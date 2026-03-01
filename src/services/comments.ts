import { apiClient } from './api';
import type { Comment } from '@/types';

export interface CreateCommentRequest {
  body: string;
  anchorRef?: string | null;
  parentCommentId?: string | null;
}

export const commentService = {
  // Owner: list comments for a version (JWT)
  async getComments(resumeId: string, versionId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/resumes/${resumeId}/versions/${versionId}/comments`);
  },

  // Owner: add comment to a version (JWT)
  async addComment(resumeId: string, versionId: string, request: CreateCommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(`/resumes/${resumeId}/versions/${versionId}/comments`, request);
  },

  // Owner: delete/moderate comment on a version (JWT)
  async deleteComment(resumeId: string, versionId: string, commentId: string): Promise<void> {
    return apiClient.delete(`/resumes/${resumeId}/versions/${versionId}/comments/${commentId}`);
  },
};
