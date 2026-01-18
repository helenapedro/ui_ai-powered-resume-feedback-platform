import { apiClient } from './api';
import type { SharedLink, SharePermission } from '@/types';

export interface CreateShareLinkRequest {
  permission: SharePermission;
  expiresAt?: string;
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
  // Create a new share link for a resume
  async createShareLink(resumeId: string, request: CreateShareLinkRequest): Promise<SharedLink> {
    return apiClient.post<SharedLink>(`/resumes/${resumeId}/share`, request);
  },

  // Get resume by share token (public endpoint)
  async getSharedResume(token: string): Promise<SharedResumeResponse> {
    return apiClient.get<SharedResumeResponse>(`/share/${token}`);
  },

  // List all share links for a resume
  async getShareLinks(resumeId: string): Promise<SharedLink[]> {
    return apiClient.get<SharedLink[]>(`/resumes/${resumeId}/shares`);
  },

  // Revoke a share link
  async revokeShareLink(resumeId: string, linkId: string): Promise<void> {
    return apiClient.delete(`/resumes/${resumeId}/share/${linkId}`);
  },
};
