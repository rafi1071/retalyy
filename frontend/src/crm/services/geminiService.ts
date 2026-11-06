import { GoogleGenAI } from '@google/genai';

export interface GeminiExtractionResult {
  documentType: string;
  confidence: number;
  institution: string;
  accountSuffix: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: string;
  readabilityScore: number;
  readabilityNotes: string;
}

/**
 * Calls Gemini Document Vision model to classify and extract fields from document text or image
 */
export async function extractWithGemini(
  fileName: string,
  contentSnippet: string
): Promise<GeminiExtractionResult | null> {
  // Check if API key is provided
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any)?.__GEMINI_API_KEY__;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the Classifier & Extractor component of Retalyy AI Document Intake System.
Analyze the following accounting document information and extract metadata strictly matching the JSON schema.

Document File Name: "${fileName}"
Document Content / OCR snippet:
"""
${contentSnippet.slice(0, 4000)}
"""

Respond with a JSON object containing:
- documentType: one of ["bank_statement", "card_statement", "payroll_report", "tax_form_941", "sales_summary", "vendor_invoice", "unknown"]
- confidence: number between 1 and 100
- institution: name of financial institution, payroll provider, or agency (e.g. JPMorgan Chase, Gusto, IRS)
- accountSuffix: last 4 digits of account/card or tax ID (e.g. "4102")
- periodStart: YYYY-MM-DD format if detected
- periodEnd: YYYY-MM-DD format if detected
- totalAmount: closing balance, gross wages, or tax total formatted with currency symbol
- readabilityScore: number between 0 and 100
- readabilityNotes: brief description of optical quality and clarity`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return parsed as GeminiExtractionResult;
    }
  } catch (err) {
    console.warn('Gemini extraction unavailable or errored, utilizing heuristic engine:', err);
  }

  return null;
}
