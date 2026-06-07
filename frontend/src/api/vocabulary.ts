import request from '../utils/request';
import type { ApiResponse } from '../types/api';

export interface VocabularyItem {
  id: number;
  word: string;
  phonetic: string;
  wrongSentence: string;
  errorCount: number;
  addedAt: string;
}

export interface VocabularyListData {
  list: VocabularyItem[];
  total: number;
  page: number;
  limit: number;
}

export interface TopErrorWord {
  word: string;
  errors: number;
  phonetic: string;
}

export interface VocabularyStats {
  totalWords: number;
  totalErrors: number;
  topErrorWords: TopErrorWord[];
}

export interface AddVocabularyParams {
  word: string;
  phonetic?: string;
  wrongSent?: string;
  userId?: string;
}

export interface VocabularyQueryParams {
  userId?: string;
  page?: number;
  limit?: number;
}

export const getVocabularyList = (params?: VocabularyQueryParams) =>
  request.get<any, ApiResponse<VocabularyListData>>('/api/vocabulary', { params });

export const addVocabulary = (data: AddVocabularyParams) =>
  request.post<any, ApiResponse<VocabularyItem>>('/api/vocabulary', data);

export const collectVocabulary = (data: Omit<AddVocabularyParams, 'phonetic'>) =>
  request.post<any, ApiResponse<VocabularyItem & { isNew: boolean }>>(
    '/api/vocabulary/collect',
    data
  );

export const deleteVocabulary = (id: number) =>
  request.delete<any, ApiResponse<{ id: number; message: string }>>(
    `/api/vocabulary/${id}`
  );

export const getVocabularyStats = (userId?: string) =>
  request.get<any, ApiResponse<VocabularyStats>>('/api/vocabulary/stats', {
    params: userId ? { userId } : undefined,
  });
