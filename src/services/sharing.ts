import { apiClient } from './api';
import { API_BASE_URL, API_PREFIX } from './api';
import { normalizeComment, normalizeComments } from './comment-normalizer';
import type { SharedLink, SharePermission, Comment, SharedResumeData } from '@/types';

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

export type SharedResumeResponse = SharedResumeData;

export const sharingService = {
  async createShareLink(resumeId: string, request: CreateShareLinkRequest): Promise<SharedLink> {
    return apiClient.post<SharedLink>(`/resumes/${resumeId}/share-links`, request);
  },

  async getSharedResume(token: string): Promise<SharedResumeResponse> {
    return apiClient.get<SharedResumeResponse>(`/share/${token}`);
  },

  getSharedResumeDownloadUrl(token: string): string {
    return `${API_BASE_URL}${API_PREFIX}/share/${token}/download`;
  },

  getSharedResumePreviewUrl(token: string): string {
    return `${API_BASE_URL}${API_PREFIX}/share/${token}/preview`;
  },

  async getSharedComments(token: string): Promise<Comment[]> {
    const comments = await apiClient.get<Comment[]>(`/share/${token}/comments`);
    return normalizeComments(comments);
  },

  async postSharedComment(token: string, request: CreateSharedCommentRequest): Promise<Comment> {
    const comment = await apiClient.post<Comment>(`/share/${token}/comments`, request);
    return normalizeComment(comment);
  },

  async updateSharedComment(token: string, commentId: string, request: UpdateSharedCommentRequest): Promise<Comment> {
    const comment = await apiClient.patch<Comment>(`/share/${token}/comments/${commentId}`, request);
    return normalizeComment(comment);
  },

  async deleteSharedComment(token: string, commentId: string): Promise<void> {
    return apiClient.delete(`/share/${token}/comments/${commentId}`);
  },

  async getShareLinks(resumeId: string): Promise<SharedLink[]> {
    return apiClient.get<SharedLink[]>(`/resumes/${resumeId}/share-links`);
  },

  async revokeShareLink(resumeId: string, linkId: string): Promise<void> {
    return apiClient.post(`/resumes/${resumeId}/share-links/${linkId}/revoke`);
  },
};
