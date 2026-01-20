import { apiClient } from './api';
import type { Comment } from '@/types';

export const commentService = {
  // Owner endpoints (JWT authenticated)
  async getComments(resumeId: string, versionId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/resumes/${resumeId}/versions/${versionId}/comments`);
  },

  async addComment(resumeId: string, versionId: string, content: string): Promise<Comment> {
    return apiClient.post<Comment>(`/resumes/${resumeId}/versions/${versionId}/comments`, { content });
  },

  async updateComment(commentId: string, content: string): Promise<{ message: string; comment: Comment }> {
    return apiClient.put(`/comments/${commentId}`, { content });
  },

  async deleteComment(commentId: string): Promise<{ message: string }> {
    return apiClient.delete(`/comments/${commentId}`);
  },
};
