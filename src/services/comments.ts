import { apiClient } from './api';
import { normalizeComment, normalizeComments } from './comment-normalizer';
import type { Comment } from '@/types';

export interface CreateCommentRequest {
  body: string;
  anchorRef?: string | null;
  parentCommentId?: string | null;
}

export const commentService = {
  async getComments(resumeId: string, versionId: string): Promise<Comment[]> {
    const comments = await apiClient.get<Comment[]>(`/resumes/${resumeId}/versions/${versionId}/comments`);
    return normalizeComments(comments);
  },

  async addComment(resumeId: string, versionId: string, request: CreateCommentRequest): Promise<Comment> {
    const comment = await apiClient.post<Comment>(`/resumes/${resumeId}/versions/${versionId}/comments`, request);
    return normalizeComment(comment);
  },

  async deleteComment(resumeId: string, versionId: string, commentId: string): Promise<void> {
    return apiClient.delete(`/resumes/${resumeId}/versions/${versionId}/comments/${commentId}`);
  },
};
