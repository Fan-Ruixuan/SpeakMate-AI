import type { ApiResponse } from '../types/api';

export type GrammarErrorType = 'grammar' | 'spelling' | 'wording' | 'punctuation';

export interface GrammarError {
  id: number;
  type: GrammarErrorType;
  message: string;
  original: string;
  replacement: string;
  startIndex: number;
  endIndex: number;
}

export interface GrammarCorrectionResult {
  originalText: string;
  correctedText: string;
  errors: GrammarError[];
  overallSuggestion: string;
}

export const correctGrammar = async (
  text: string
): Promise<ApiResponse<GrammarCorrectionResult>> => {
  const res = await fetch('/api/grammar/correct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    const err: any = new Error(errorText || `HTTP ${res.status}`);
    err.response = { status: res.status, data: errorText };
    throw err;
  }

  return res.json() as Promise<ApiResponse<GrammarCorrectionResult>>;
};
