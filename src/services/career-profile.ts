import { apiClient } from './api';
import type {
  CareerCancelSessionRequest,
  CareerConfirmationResponse,
  CareerConfirmProposalRequest,
  CareerProfileResponse,
  CareerResumeImportRequest,
  CareerResumeImportResponse,
  CareerSessionDetailResponse,
  CareerSessionResponse,
  CareerSubmitTurnRequest,
  CareerTurnResponse,
} from '@/types';

export const careerProfileService = {
  async createSession(): Promise<CareerSessionResponse> {
    return apiClient.post<CareerSessionResponse>('/career-profile/sessions');
  },

  async getSession(sessionId: string): Promise<CareerSessionDetailResponse> {
    return apiClient.get<CareerSessionDetailResponse>(`/career-profile/sessions/${sessionId}`);
  },

  async submitTurn(sessionId: string, request: CareerSubmitTurnRequest): Promise<CareerTurnResponse> {
    return apiClient.post<CareerTurnResponse>(`/career-profile/sessions/${sessionId}/messages`, request);
  },

  async confirmProposal(
    sessionId: string,
    request: CareerConfirmProposalRequest,
  ): Promise<CareerConfirmationResponse> {
    return apiClient.post<CareerConfirmationResponse>(
      `/career-profile/sessions/${sessionId}/confirmations`,
      request,
    );
  },

  async cancelSession(sessionId: string, request: CareerCancelSessionRequest): Promise<CareerSessionResponse> {
    return apiClient.post<CareerSessionResponse>(`/career-profile/sessions/${sessionId}/cancel`, request);
  },

  async getProfile(): Promise<CareerProfileResponse> {
    return apiClient.get<CareerProfileResponse>('/career-profile');
  },

  async importFromResume(
    request: CareerResumeImportRequest,
  ): Promise<CareerResumeImportResponse> {
    return apiClient.post<CareerResumeImportResponse>('/career-profile/imports', request);
  },
};
