import { apiClient } from './api';
import type { Comment } from '@/types';

export interface CreateCommentRequest {
  body: string;
  anchorRef?: string | null;
  parentCommentId?: string | null;
}

export const commentService = {
  async getComments(resumeId: string, versionId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/resumes/${resumeId}/versions/${versionId}/comments`);
  },

  async addComment(resumeId: string, versionId: string, request: CreateCommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(`/resumes/${resumeId}/versions/${versionId}/comments`, request);
  },

  async deleteComment(resumeId: string, versionId: string, commentId: string): Promise<void> {
    return apiClient.delete(`/resumes/${resumeId}/versions/${versionId}/comments/${commentId}`);
  },
};
