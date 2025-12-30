import axios from 'axios';
import { createWorker } from 'tesseract.js';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokAnalysisResponse {
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
}

// Singleton instance
let grokServiceInstance: GrokAIService | null = null;

export class GrokAIService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GROK_API_KEY || '';
    this.apiUrl = process.env.GROK_API_URL || 'https://api.x.ai/v1';
    this.model = process.env.GROK_MODEL || 'grok-beta';

    if (!this.apiKey) {
      throw new Error('GROK_API_KEY is not configured');
    }
  }

  // Static method to get singleton instance
  static getInstance(): GrokAIService {
    if (!grokServiceInstance) {
      grokServiceInstance = new GrokAIService();
    }
    return grokServiceInstance;
  }

  async analyzeDocument(documentContent: string): Promise<GrokAnalysisResponse> {
  
    const MAX_CONTENT_LENGTH = 5000; // ~1,250 tokens for content, leaving room for prompts and response
    let content = documentContent;
    
    if (content.length > MAX_CONTENT_LENGTH) {
      console.log(`Document too long (${content.length} chars), truncating to ${MAX_CONTENT_LENGTH} chars`);
      content = content.substring(0, MAX_CONTENT_LENGTH) + '\n\n[Document truncated due to length. Please upload smaller documents or analyze specific sections for complete analysis.]';
    }

    const systemPrompt = `You are a legal document analysis AI. You MUST respond ONLY with valid JSON - no additional text, explanations, or commentary.

CRITICAL: Your response must be ONLY a JSON object with this exact structure:
{
  "summary": "Brief overview of the document in plain language",
  "keyClauses": [{"clause": "clause text", "position": "section reference", "explanation": "plain language explanation", "importance": "high"}],
  "legalTerms": [{"term": "legal term", "definition": "formal definition", "simplifiedExplanation": "easy explanation"}],
  "riskFactors": [{"risk": "identified risk", "severity": "high", "explanation": "what this means"}]
}

If the document is unclear, still return valid JSON with a summary explaining the limitation. Never respond with plain text or markdown.`;

    const messages: GrokMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please analyze the following legal document:\n\n${content}` }
    ];

    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: messages,
          temperature: 0.2,  // Lower temperature for more consistent JSON
          max_tokens: 2000,
          response_format: { type: "json_object" }  // Force JSON mode if supported
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        console.error('No content in Groq response:', response.data);
        throw new Error('No response from Groq AI');
      }

      // Parse the JSON response with error handling
      try {
        // Try to extract JSON if it's wrapped in markdown code blocks
        let jsonContent = content.trim();
        if (jsonContent.startsWith('```json')) {
          jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/```\s*$/, '');
        } else if (jsonContent.startsWith('```')) {
          jsonContent = jsonContent.replace(/^```\s*/, '').replace(/```\s*$/, '');
        }
        
        const analysisResult = JSON.parse(jsonContent);
        return analysisResult;
      } catch (parseError) {
        console.error('Failed to parse Groq AI response as JSON:', content);
        // Return a fallback response instead of throwing
        return {
          summary: 'Unable to analyze document properly. The AI did not return a valid response. Please try with a different document or a smaller section.',
          keyClauses: [{
            clause: 'Analysis incomplete',
            position: 'N/A',
            explanation: 'The document could not be analyzed due to formatting or content issues.',
            importance: 'high' as const
          }],
          legalTerms: [],
          riskFactors: [{
            risk: 'Document not properly analyzed',
            severity: 'high' as const,
            explanation: 'Please ensure the document is text-based (not a scanned image) and try again with a smaller section.'
          }]
        };
      }
    } catch (error) {
      console.error('Error calling Groq AI:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Response:', error.response?.data);
        console.error('API Status:', error.response?.status);
        const errorMessage = error.response?.data?.error?.message || error.message;
        throw new Error(`Failed to analyze document: ${errorMessage}`);
      }
      throw new Error('Failed to analyze document with Groq AI');
    }
  }

  async extractKeyPhrases(text: string): Promise<string[]> {
    const messages: GrokMessage[] = [
      { 
        role: 'system', 
        content: 'Extract the most important legal phrases and terms from the provided text. Return as a JSON array of strings.' 
      },
      { role: 'user', content: text }
    ];

    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: messages,
          temperature: 0.2,
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from Grok AI');
      }

      // Parse the JSON response with error handling
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse key phrases response as JSON:', content);
        // Return empty array as fallback
        return [];
      }
    } catch (error) {
      console.error('Error extracting key phrases:', error);
      throw new Error('Failed to extract key phrases');
    }
  }

  async simplifyLegalText(text: string): Promise<string> {
    const messages: GrokMessage[] = [
      { 
        role: 'system', 
        content: 'You are a legal translator. Convert complex legal language into simple, everyday language that non-legal professionals can understand.' 
      },
      { role: 'user', content: text }
    ];

    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages: messages,
          temperature: 0.3,
          max_tokens: 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error simplifying legal text:', error);
      throw new Error('Failed to simplify legal text');
    }
  }

  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    try {
      console.log('Starting OCR text extraction...');
      // Use default configuration for Node.js environment
      const worker = await createWorker('eng');
      
      const { data: { text } } = await worker.recognize(imageBuffer);
      await worker.terminate();
      
      console.log(`OCR extraction completed. Extracted ${text.length} characters.`);
      return text.trim();
    } catch (error) {
      console.error('Error extracting text from image:', error);
      throw new Error('Failed to extract text from image using OCR');
    }
  }
}
