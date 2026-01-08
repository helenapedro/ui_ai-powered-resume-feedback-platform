import { apiClient } from './api';
import type { Resume, ResumeVersion, PaginatedResponse } from '@/types';

export const resumeService = {
  async getAllResumes(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Resume>> {
    return apiClient.get<PaginatedResponse<Resume>>(`/resumes/all?page=${page}&limit=${limit}`);
  },

  async getMyResumes(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Resume>> {
    return apiClient.get<PaginatedResponse<Resume>>(`/resumes?page=${page}&limit=${limit}`);
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

  async updateDescription(resumeId: string, description: string): Promise<{ message: string; resume: Resume }> {
    return apiClient.put('/resumes/update-description', { resumeId, description });
  },

  async deleteResume(resumeId: string): Promise<{ message: string }> {
    return apiClient.delete('/resumes', { resumeId });
  },

  async getVersions(resumeId: string): Promise<ResumeVersion[]> {
    return apiClient.get<ResumeVersion[]>(`/resumes/${resumeId}/versions`);
  },

  async restoreVersion(resumeId: string, versionId: string): Promise<{ message: string; resume: Resume }> {
    return apiClient.post(`/resumes/${resumeId}/restore/${versionId}`);
  },
};
