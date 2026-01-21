import { apiClient } from './api';
import type { SharedLink, SharePermission, Comment } from '@/types';

export interface CreateShareLinkRequest {
  permission: SharePermission;
  expiresAt?: string;
  maxUses?: number;
}

export interface SharedResumeResponse {
  resume: {
    id: string;
    title: string;
  };
  version: {
    id: string;
    versionNumber: number;
    originalFilename: string;
    contentType: string;
  };
  permission: SharePermission;
}

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
    return `${import.meta.env.VITE_API_URL || 'https://janett-achlamydate-springingly.ngrok-free.dev/api'}/share/${token}/download`;
  },

  // Get comments for shared resume (public)
  async getSharedComments(token: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/share/${token}/comments`);
  },

  // Post comment on shared resume (public, requires COMMENT permission)
  async postSharedComment(token: string, content: string): Promise<Comment> {
    return apiClient.post<Comment>(`/share/${token}/comments`, { body: content });
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
