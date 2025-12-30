import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { GrokAIService } from '@/lib/grok-ai';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      console.error('Upload failed: No authenticated user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file || !title) {
      console.error('Upload failed: Missing file or title');
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      );
    }

    // Read file content
    let content: string;
    try {
      // Check if it's an image file
      if (file.type.startsWith('image/')) {
        console.log(`Processing image file: ${file.name}`);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Use OCR to extract text from the image
        try {
          const grokService = GrokAIService.getInstance();
          content = await grokService.extractTextFromImage(buffer);
          
          if (!content || content.trim().length === 0) {
            content = '[Image processed but no text could be extracted. The image may be blank, too low quality, or contain only non-text elements.]';
          } else {
            console.log(`Successfully extracted ${content.length} characters from image`);
          }
        } catch (ocrError) {
          console.error('OCR extraction failed:', ocrError);
          content = `[Image file: ${file.name}. OCR text extraction failed. Error: ${ocrError instanceof Error ? ocrError.message : 'Unknown error'}]`;
        }
      } else {
        // Try to read as text
        content = await file.text();
        
        // Remove null bytes and other problematic characters for PostgreSQL
        content = content.replace(/\0/g, '').trim();
      }
    } catch (error) {
      // If file is binary (PDF, DOCX), convert to base64 or handle appropriately
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // For now, store file info instead of full content for binary files
      if (file.type === 'application/pdf' || file.type.includes('word')) {
        content = `[Binary file: ${file.name}. File type: ${file.type}. Size: ${file.size} bytes. Content extraction not yet implemented for this file type.]`;
      } else {
        // Try to decode as text and sanitize
        content = buffer.toString('utf-8').replace(/\0/g, '').trim();
      }
    }

    // Validate content length
    if (content.length === 0) {
      console.error('Upload failed: Empty file content');
      return NextResponse.json(
        { error: 'File appears to be empty or unreadable' },
        { status: 400 }
      );
    }

    // Save document to database using authenticated user ID
    const document = await prisma.document.create({
      data: {
        title,
        content,
        fileType: file.type || 'text/plain',
        fileSize: file.size,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        fileType: document.fileType,
        fileSize: document.fileSize,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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

    // Fetch documents for authenticated user only
    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { uploadedAt: 'desc' },
      include: {
        analyses: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
