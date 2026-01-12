import { apiClient } from './api';
import type { Comment } from '@/types';

export const commentService = {
  async getComments(resumeId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/comments/${resumeId}`);
  },

  async addComment(resumeId: string, content: string): Promise<{ message: string; comment: Comment }> {
    return apiClient.post('/comments/add', { resumeId, content });
  },

  async updateComment(commentId: string, content: string): Promise<{ message: string; comment: Comment }> {
    return apiClient.put(`/comments/${commentId}`, { content });
  },

  async deleteComment(commentId: string): Promise<{ message: string }> {
    return apiClient.delete(`/comments/${commentId}`);
  },
};
