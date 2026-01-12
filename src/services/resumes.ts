import { apiClient } from './api';
import type { Resume, ResumeVersion, PaginatedResponse } from '@/types';

export const resumeService = {
  async getAllResumes(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Resume>> {
    return apiClient.get<PaginatedResponse<Resume>>(`/resumes/all?page=${page}&limit=${limit}`);
  },

  async getMyResume(): Promise<Resume | null> {
    try {
      const data = await apiClient.get<Resume>('/resumes/');
      return data;
    } catch (error) {
      // If no resume found, return null instead of throwing
      return null;
    }
  },

  async getResumeById(id: string): Promise<Resume> {
    return apiClient.get<Resume>(`/resumes/${id}`);
  },

  async uploadResume(file: File, description?: string): Promise<{ message: string; resume: Resume }> {
    const formData = new FormData();
    formData.append('resume', file);
    
    // Determine format from file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const format = fileExtension === 'pdf' ? 'pdf' : 
                   ['jpg', 'jpeg', 'png'].includes(fileExtension || '') ? 'image' : 'pdf';
    formData.append('format', format);
    
    if (description) {
      formData.append('description', description);
    }
    return apiClient.post('/resumes/upload', formData);
  },

  async updateDescription(description: string): Promise<{ message: string; resume: Resume }> {
    return apiClient.put('/resumes/update-description', { description });
  },

  async deleteResume(): Promise<{ message: string }> {
    return apiClient.delete('/resumes');
  },

  async getVersions(): Promise<ResumeVersion[]> {
    return apiClient.get<ResumeVersion[]>('/resumes/versions');
  },

  async getVersionUrl(versionId: string): Promise<{ url: string }> {
    return apiClient.get<{ url: string }>(`/resumes/versions/${versionId}/url`);
  },

  async restoreVersion(versionId: string): Promise<{ message: string; resume: Resume }> {
    return apiClient.post(`/resumes/restore/${versionId}`);
  },
};
