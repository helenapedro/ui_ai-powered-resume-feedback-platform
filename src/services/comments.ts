import { apiClient } from './api';
import type { Comment } from '@/types';

export interface CreateCommentRequest {
  body: string;
  anchorRef?: string | null;
  parentCommentId?: string | null;
  guestLabel?: string | null;
}

export const commentService = {
  // Owner endpoints (JWT authenticated)
  async getComments(resumeId: string, versionId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/resumes/${resumeId}/versions/${versionId}/comments`);
  },

  async addComment(resumeId: string, versionId: string, request: CreateCommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(`/resumes/${resumeId}/versions/${versionId}/comments`, request);
  },

  async updateComment(commentId: string, content: string): Promise<{ message: string; comment: Comment }> {
    return apiClient.put(`/comments/${commentId}`, { content });
  },

  async deleteComment(commentId: string): Promise<{ message: string }> {
    return apiClient.delete(`/comments/${commentId}`);
  },
};
