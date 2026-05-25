import { apiClient } from './api';
import { API_BASE_URL, API_PREFIX, buildApiUrl } from './api';
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

  async resolveVersionPreviewUrl(resumeId: string, versionId: string): Promise<string> {
    const response = await apiClient.get<{ url: string }>(`/resumes/${resumeId}/versions/${versionId}/preview-url`);

    if (!response.url) {
      throw new Error('Preview URL was not returned.');
    }

    return response.url;
  },

  async downloadVersion(resumeId: string, versionId: string, token: string, filename = 'resume.pdf'): Promise<void> {
    const response = await fetch(buildApiUrl(`/resumes/${resumeId}/versions/${versionId}/download`), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Unable to download PDF: ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(objectUrl);
  },

  async ping(): Promise<string> {
    return apiClient.get<string>('/ping');
  },
};
