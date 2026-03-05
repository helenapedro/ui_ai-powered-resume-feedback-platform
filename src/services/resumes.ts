import { apiClient } from './api';
import { API_BASE_URL, API_PREFIX } from './api';
import type { ResumeSummary, ResumeVersion, ResumeWithVersions } from '@/types';

export const resumeService = {
  async getAllResumes(): Promise<ResumeSummary[]> {
    return apiClient.get<ResumeSummary[]>('/resumes');
  },

  async getResumeById(id: string): Promise<ResumeWithVersions> {
    return apiClient.get<ResumeWithVersions>(`/resumes/${id}`);
  },

  async createResume(file: File, title?: string): Promise<ResumeSummary> {
    const formData = new FormData();
    formData.append('file', file);
    if (title) {
      formData.append('title', title);
    }
    return apiClient.post<ResumeSummary>('/resumes', formData);
  },

  async addVersion(resumeId: string, file: File): Promise<ResumeVersion> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ResumeVersion>(`/resumes/${resumeId}/versions`, formData);
  },

  async deleteResume(resumeId: string): Promise<void> {
    return apiClient.delete(`/resumes/${resumeId}`);
  },

  getVersionDownloadUrl(resumeId: string, versionId: string): string {
    return `${API_BASE_URL}${API_PREFIX}/resumes/${resumeId}/versions/${versionId}/download`;
  },

  getVersionPreviewUrl(resumeId: string, versionId: string): string {
    return `${API_BASE_URL}${API_PREFIX}/resumes/${resumeId}/versions/${versionId}/preview`;
  },

  async ping(): Promise<string> {
    return apiClient.get<string>('/ping');
  },
};
