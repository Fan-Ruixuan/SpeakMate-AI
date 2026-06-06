import type { ApiResponse } from '../types/api';

export interface PronunciationEvaluationResult {
  totalScore: number;
  fluency: number;
  accuracy: number;
  completeness: number;
  phonemeErrors: Array<{
    word: string;
    targetPhoneme: string;
    actualPhoneme: string;
    position: number;
  }>;
  suggestion: string;
  referenceText: string;
}

export const evaluatePronunciation = async (
  audioFile: File,
  referenceText: string
): Promise<ApiResponse<PronunciationEvaluationResult>> => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  formData.append('referenceText', referenceText);

  const res = await fetch('/api/pronunciation/evaluate', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    const err: any = new Error(errorText || `HTTP ${res.status}`);
    err.response = { status: res.status, data: errorText };
    throw err;
  }

  return res.json() as Promise<ApiResponse<PronunciationEvaluationResult>>;
};