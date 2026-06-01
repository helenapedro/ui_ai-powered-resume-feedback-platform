import { apiClient } from './api';
import type { AiFeedbackDTO, AiJobDTO, AiProgressDTO } from '@/types';

export const aiService = {
  async getLatestJob(resumeId: string, versionId: string): Promise<AiJobDTO> {
    return apiClient.get<AiJobDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-jobs/latest`);
  },

  async regenerate(resumeId: string, versionId: string): Promise<AiJobDTO> {
    return apiClient.post<AiJobDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-jobs/regenerate?language=AUTO`);
  },

  async getFeedback(resumeId: string, versionId: string): Promise<AiFeedbackDTO> {
    return apiClient.get<AiFeedbackDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-feedback`);
  },

  async getProgress(resumeId: string, versionId: string): Promise<AiProgressDTO> {
    return apiClient.get<AiProgressDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-progress`);
  },
};
