import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GrokAIService } from '@/lib/grok-ai';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Fetch the document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Verify ownership using authenticated user ID
    if (document.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if content indicates an unsupported file (but allow images since we have OCR now)
    if (document.content.includes('[Binary file:')) {
      return NextResponse.json(
        { 
          error: 'Unsupported file type',
          message: 'This file type cannot be analyzed yet. Please upload a text-based document (TXT) or image (JPG, PNG) for analysis.'
        },
        { status: 400 }
      );
    }

    // Check if OCR failed to extract text from image
    if (document.content.includes('[Image processed but no text could be extracted')) {
      return NextResponse.json(
        { 
          error: 'No text found in image',
          message: 'The image appears to be blank or contains no readable text. Please ensure the image is clear and contains text.'
        },
        { status: 400 }
      );
    }

    // Analyze document with Grok AI using singleton instance
    const grokService = GrokAIService.getInstance();
    const analysisResult = await grokService.analyzeDocument(document.content);

    // Save analysis to database using authenticated user ID
    const analysis = await prisma.analysis.create({
      data: {
        documentId: document.id,
        userId: user.id,
        summary: analysisResult.summary,
        keyClauses: analysisResult.keyClauses,
        legalTerms: analysisResult.legalTerms,
        riskFactors: analysisResult.riskFactors,
      },
    });

    return NextResponse.json({
      success: true,
      analysis: {
        id: analysis.id,
        summary: analysis.summary,
        keyClauses: analysis.keyClauses,
        legalTerms: analysis.legalTerms,
        riskFactors: analysis.riskFactors,
        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error('Error analyzing document:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Fetch all analyses for the document, filtered by authenticated user
    const analyses = await prisma.analysis.findMany({
      where: { 
        documentId,
        userId: user.id
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}
