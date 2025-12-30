'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DocumentUpload from '@/components/DocumentUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { Loader2, FileText, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }


  const handleUploadComplete = async (documentId: string) => {
    setAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError('Failed to analyze document. Please try again.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">LegalLens AI Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">{session.user.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Upload Section */}
        {!analyzing && !analysis && (
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Upload Your Legal Document
            </h2>
            <DocumentUpload onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {/* Analyzing State */}
        {analyzing && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">Analyzing Document</h2>
            <p className="text-sm sm:text-base text-gray-600 text-center">Please wait while Grok AI analyzes your document...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Analysis Results</h2>
              <button
                onClick={() => {
                  setAnalysis(null);
                  setError('');
                }}
                className="px-4 py-2 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
              >
                Analyze Another Document
              </button>
            </div>
            <AnalysisResult analysis={analysis} />
          </div>
        )}
      </main>
    </div>
  );
}
