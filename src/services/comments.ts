import { apiClient } from './api';
import type { Comment } from '@/types';

export const commentService = {
  async getComments(resumeId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/comments/${resumeId}`);
  },

  async addComment(resumeId: string, text: string): Promise<{ message: string; comment: Comment }> {
    return apiClient.post('/comments/add', { resumeId, text });
  },

  async updateComment(commentId: string, text: string): Promise<{ message: string; comment: Comment }> {
    return apiClient.put(`/comments/${commentId}`, { text });
  },

  async deleteComment(commentId: string): Promise<{ message: string }> {
    return apiClient.delete(`/comments/${commentId}`);
  },
};
