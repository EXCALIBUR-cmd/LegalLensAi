'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AnalysisResultProps {
  analysis: {
    summary: string;
    keyClauses: Array<{
      clause: string;
      position: string;
      explanation: string;
      importance: 'high' | 'medium' | 'low';
    }>;
    legalTerms: Array<{
      term: string;
      definition: string;
      simplifiedExplanation: string;
    }>;
    riskFactors: Array<{
      risk: string;
      severity: 'high' | 'medium' | 'low';
      explanation: string;
    }>;
  };
}

const importanceColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

const severityColors = {
  high: 'bg-red-50 border-red-200',
  medium: 'bg-yellow-50 border-yellow-200',
  low: 'bg-blue-50 border-blue-200',
};

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Document Summary</h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Key Clauses Section */}
      {analysis.keyClauses && analysis.keyClauses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Key Clauses</h2>
          <div className="space-y-3 sm:space-y-4">
            {analysis.keyClauses.map((clause, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 sm:p-4 ${importanceColors[clause.importance]}`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="font-semibold text-xs sm:text-sm uppercase">
                      {clause.importance} Importance
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{clause.position}</span>
                </div>
                <p className="text-sm sm:text-base font-medium mb-2">{clause.clause}</p>
                <p className="text-xs sm:text-sm opacity-90">{clause.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Terms Section */}
      {analysis.legalTerms && analysis.legalTerms.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Legal Terms Explained</h2>
          <div className="space-y-3 sm:space-y-4">
            {analysis.legalTerms.map((term, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <h3 className="font-bold text-base sm:text-lg text-gray-900">{term.term}</h3>
                </div>
                <div className="space-y-2 ml-0 sm:ml-7">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-600">Legal Definition:</p>
                    <p className="text-sm sm:text-base text-gray-700">{term.definition}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-600">In Simple Terms:</p>
                    <p className="text-sm sm:text-base text-gray-700">{term.simplifiedExplanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors Section */}
      {analysis.riskFactors && analysis.riskFactors.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Risk Factors</h2>
          <div className="space-y-3 sm:space-y-4">
            {analysis.riskFactors.map((risk, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 sm:p-4 ${severityColors[risk.severity]}`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertCircle className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 ${
                    risk.severity === 'high' ? 'text-red-600' :
                    risk.severity === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900">{risk.risk}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded uppercase inline-block whitespace-nowrap ${
                        risk.severity === 'high' ? 'bg-red-200 text-red-800' :
                        risk.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {risk.severity} Risk
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">{risk.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
