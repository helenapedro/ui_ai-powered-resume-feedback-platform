import { apiClient } from '@/services/api-client';
import type {
  CreateTargetOpportunityRequest,
  TargetOpportunity,
  TargetedVersionLink,
  TargetedReviewDTO,
  TargetedReviewJobDTO,
  UpdateTargetOpportunityRequest,
} from '@/types';

export const targetOpportunityService = {
  async getTargetOpportunities(resumeId: string): Promise<TargetOpportunity[]> {
    return apiClient.get<TargetOpportunity[]>(`/resumes/${resumeId}/target-opportunities`);
  },

  async createTargetOpportunity(
    resumeId: string,
    request: CreateTargetOpportunityRequest
  ): Promise<TargetOpportunity> {
    return apiClient.post<TargetOpportunity>(`/resumes/${resumeId}/target-opportunities`, request);
  },

  async updateTargetOpportunity(
    resumeId: string,
    opportunityId: string,
    request: UpdateTargetOpportunityRequest
  ): Promise<TargetOpportunity> {
    return apiClient.patch<TargetOpportunity>(
      `/resumes/${resumeId}/target-opportunities/${opportunityId}`,
      request
    );
  },

  async deleteTargetOpportunity(resumeId: string, opportunityId: string): Promise<void> {
    return apiClient.delete<void>(`/resumes/${resumeId}/target-opportunities/${opportunityId}`);
  },

  async getTargetedVersionLinks(resumeId: string): Promise<TargetedVersionLink[]> {
    return apiClient.get<TargetedVersionLink[]>(`/resumes/${resumeId}/target-opportunities/links`);
  },

  async linkTargetedVersion(
    resumeId: string,
    opportunityId: string,
    versionId: string
  ): Promise<TargetedVersionLink> {
    return apiClient.post<TargetedVersionLink>(
      `/resumes/${resumeId}/target-opportunities/${opportunityId}/versions/${versionId}/link`
    );
  },

  async createTargetedReviewJob(resumeId: string, opportunityId: string): Promise<TargetedReviewJobDTO> {
    return apiClient.post<TargetedReviewJobDTO>(
      `/resumes/${resumeId}/target-opportunities/${opportunityId}/reviews`
    );
  },

  async getLatestTargetedReviewJob(resumeId: string, opportunityId: string): Promise<TargetedReviewJobDTO> {
    return apiClient.get<TargetedReviewJobDTO>(
      `/resumes/${resumeId}/target-opportunities/${opportunityId}/reviews/latest-job`
    );
  },

  async getLatestTargetedReview(resumeId: string, opportunityId: string): Promise<TargetedReviewDTO> {
    return apiClient.get<TargetedReviewDTO>(
      `/resumes/${resumeId}/target-opportunities/${opportunityId}/reviews/latest`
    );
  },
};
