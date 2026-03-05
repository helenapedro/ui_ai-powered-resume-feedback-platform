import { apiClient } from './api';
import { API_BASE_URL, API_PREFIX } from './api';
import type { ResumeSummary, ResumeVersion, ResumeWithVersions } from '@/types';

export const resumeService = {
  // List all resumes for the current user
  async getAllResumes(): Promise<ResumeSummary[]> {
    return apiClient.get<ResumeSummary[]>('/resumes');
  },

  // Get a single resume with all its versions
  async getResumeById(id: string): Promise<ResumeWithVersions> {
    return apiClient.get<ResumeWithVersions>(`/resumes/${id}`);
  },

  // Create a new resume with file upload
  async createResume(file: File, title?: string): Promise<ResumeSummary> {
    const formData = new FormData();
    formData.append('file', file);
    if (title) {
      formData.append('title', title);
    }
    return apiClient.post<ResumeSummary>('/resumes', formData);
  },

  // Add a new version to an existing resume
  async addVersion(resumeId: string, file: File): Promise<ResumeVersion> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ResumeVersion>(`/resumes/${resumeId}/versions`, formData);
  },

  // Delete a resume
  async deleteResume(resumeId: string): Promise<void> {
    return apiClient.delete(`/resumes/${resumeId}`);
  },

  // Download a specific version of a resume
  getVersionDownloadUrl(resumeId: string, versionId: string): string {
    return `${API_BASE_URL}${API_PREFIX}/resumes/${resumeId}/versions/${versionId}/download`;
  },

  // Preview a specific version inline
  getVersionPreviewUrl(resumeId: string, versionId: string): string {
    return `${API_BASE_URL}${API_PREFIX}/resumes/${resumeId}/versions/${versionId}/preview`;
  },

  // Ping endpoint for testing connectivity
  async ping(): Promise<string> {
    return apiClient.get<string>('/ping');
  },
};
