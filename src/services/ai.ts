import { apiClient } from './api';
import type { AiJobDTO, AiFeedbackDTO } from '@/types';

export const aiService = {
  // Get latest AI job for a version
  async getLatestJob(resumeId: string, versionId: string): Promise<AiJobDTO> {
    return apiClient.get<AiJobDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-jobs/latest`);
  },

  // Regenerate AI feedback
  async regenerate(resumeId: string, versionId: string): Promise<AiJobDTO> {
    return apiClient.post<AiJobDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-jobs/regenerate`);
  },

  // Get AI feedback for a version
  async getFeedback(resumeId: string, versionId: string): Promise<AiFeedbackDTO> {
    return apiClient.get<AiFeedbackDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-feedback`);
  },
};
