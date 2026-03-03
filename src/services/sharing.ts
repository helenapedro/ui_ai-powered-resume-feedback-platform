import { apiClient } from './api';
import type { SharedLink, SharePermission, Comment, SharedResumeData } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://resumefeedback-api.hmpedro.com/api';

export interface CreateShareLinkRequest {
  permission: SharePermission;
  expiresAt?: string | null;
  maxUses?: number | null;
}

export interface CreateSharedCommentRequest {
  body: string;
  anchorRef?: string | null;
  parentCommentId?: string | null;
}

export interface UpdateSharedCommentRequest {
  body: string;
  anchorRef?: string | null;
}

// Re-export for backward compatibility
export type SharedResumeResponse = SharedResumeData;

export const sharingService = {
  // Create a new share link for a resume (JWT)
  async createShareLink(resumeId: string, request: CreateShareLinkRequest): Promise<SharedLink> {
    return apiClient.post<SharedLink>(`/resumes/${resumeId}/share-links`, request);
  },

  // Get resume metadata by share token (public)
  async getSharedResume(token: string): Promise<SharedResumeResponse> {
    return apiClient.get<SharedResumeResponse>(`/share/${token}`);
  },

  // Download current version via share token (public)
  getSharedResumeDownloadUrl(token: string): string {
    return `${API_BASE_URL}/share/${token}/download`;
  },

  // Preview current version inline via share token (public)
  getSharedResumePreviewUrl(token: string): string {
    return `${API_BASE_URL}/share/${token}/preview`;
  },

  // Get comments for shared resume (token + JWT required)
  async getSharedComments(token: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/share/${token}/comments`);
  },

  // Post comment on shared resume (token + JWT required, COMMENT permission)
  async postSharedComment(token: string, request: CreateSharedCommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(`/share/${token}/comments`, request);
  },

  // Update comment on shared resume (token + JWT required)
  async updateSharedComment(token: string, commentId: string, request: UpdateSharedCommentRequest): Promise<Comment> {
    return apiClient.patch<Comment>(`/share/${token}/comments/${commentId}`, request);
  },

  // Delete comment on shared resume (token + JWT required)
  async deleteSharedComment(token: string, commentId: string): Promise<void> {
    return apiClient.delete(`/share/${token}/comments/${commentId}`);
  },

  // List all share links for a resume (JWT)
  async getShareLinks(resumeId: string): Promise<SharedLink[]> {
    return apiClient.get<SharedLink[]>(`/resumes/${resumeId}/share-links`);
  },

  // Revoke a share link (JWT)
  async revokeShareLink(resumeId: string, linkId: string): Promise<void> {
    return apiClient.post(`/resumes/${resumeId}/share-links/${linkId}/revoke`);
  },
};
