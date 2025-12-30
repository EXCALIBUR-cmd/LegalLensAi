import Link from "next/link";
import { FileText, Scale, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">LegalLens AI</span>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Link href="/auth/signin" className="px-3 py-2 sm:px-4 text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 sm:px-6 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Simplify Legal Documents with AI
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            An AI-assisted platform for simplifying legal document analysis, 
            offering summarized insights and identifying key clauses for non-legal professionals.
          </p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white text-base sm:text-lg rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="h-5 w-5" />
            <span className="hidden sm:inline">Analyze Your First Document</span>
            <span className="sm:hidden">Get Started</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
          How LegalLens AI Helps You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Clear Summaries
            </h3>
            <p className="text-gray-600">
              Get instant, easy-to-understand summaries of complex legal documents without the jargon.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Key Clause Identification
            </h3>
            <p className="text-gray-600">
              Automatically identify and explain important clauses that matter most to you.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Risk Assessment
            </h3>
            <p className="text-gray-600">
              Identify potential risks and important considerations in your legal documents.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            LegalLens AI uses Grok AI with the Llama model for natural language processing, 
            summarization, and key phrase extraction, built on Next.js with Prisma for robust data management.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Next.js</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Prisma</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Grok AI (Llama)</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">TypeScript</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Tailwind CSS</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 LegalLens AI. Making legal documents accessible to everyone.</p>
        </div>
      </footer>
    </main>
  );
}
