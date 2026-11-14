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

  async createVersionPreviewObjectUrl(resumeId: string, versionId: string, token: string): Promise<string> {
    const response = await fetch(buildApiUrl(`/resumes/${resumeId}/versions/${versionId}/preview`), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Unable to load PDF preview: ${response.status}`);
    }

    const responseBlob = await response.blob();

    if (responseBlob.size === 0) {
      throw new Error('PDF preview response was empty.');
    }

    const pdfBlob = responseBlob.type === 'application/pdf'
      ? responseBlob
      : new Blob([responseBlob], { type: 'application/pdf' });

    return URL.createObjectURL(pdfBlob);
  },

  async resolveVersionDownloadUrl(resumeId: string, versionId: string): Promise<string> {
    const response = await apiClient.get<{ url: string }>(`/resumes/${resumeId}/versions/${versionId}/download-url`);

    if (!response.url) {
      throw new Error('Download URL was not returned.');
    }

    return response.url;
  },

  async downloadVersion(resumeId: string, versionId: string, token: string, filename = 'resume.pdf'): Promise<void> {
    try {
      const downloadUrl = await resumeService.resolveVersionDownloadUrl(resumeId, versionId);

      if (!downloadUrl.startsWith(API_BASE_URL)) {
        // Presigned storage URL (S3): a top-level navigation is not subject
        // to CORS, and the URL's attachment disposition makes the browser
        // download it with the stored filename.
        const link = document.createElement('a');

        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();

        return;
      }
    } catch {
      // The download-url endpoint is not deployed yet, or resolving failed:
      // fall through to the fetch path below.
    }

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
