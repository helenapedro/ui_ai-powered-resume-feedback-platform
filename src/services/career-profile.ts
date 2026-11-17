import { apiClient } from './api';
import { buildApiUrl } from './api-config';
import { parseApiError, throwApiError } from './api-errors';
import { sessionService } from './session';
import type {
  CareerCancelSessionRequest,
  CareerConfirmationResponse,
  CareerConfirmProposalRequest,
  CareerExperienceResponse,
  CareerProfileResponse,
  CareerResumeImportRequest,
  CareerResumeImportResponse,
  CareerSessionDetailResponse,
  CareerSessionResponse,
  CareerSubmitTurnRequest,
  CareerSynthesizeAudioRequest,
  CareerTranscribeAudioResponse,
  CareerTurnResponse,
  CareerUpdateExperienceRequest,
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

  async updateExperience(
    originProposalId: string,
    request: CareerUpdateExperienceRequest,
  ): Promise<CareerExperienceResponse> {
    return apiClient.patch<CareerExperienceResponse>(
      `/career-profile/experiences/${originProposalId}`,
      request,
    );
  },

  async transcribeAudio(
    sessionId: string,
    audio: Blob,
    filename: string,
  ): Promise<CareerTranscribeAudioResponse> {
    const formData = new FormData();
    formData.append('audio', audio, filename);
    return apiClient.post<CareerTranscribeAudioResponse>(
      `/career-profile/sessions/${sessionId}/audio/transcribe`,
      formData,
    );
  },

  /**
   * Synthesizes one assistant reply as speech. The shared apiClient parses
   * every response as JSON, so it cannot return audio bytes; this is a small
   * binary fetch for the synthesize proxy only. The caller owns playback and
   * treats any failure as best effort: the text reply stays on screen.
   */
  async synthesizeAudio(
    sessionId: string,
    request: CareerSynthesizeAudioRequest,
  ): Promise<ArrayBuffer> {
    const token = sessionService.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(
      buildApiUrl(`/career-profile/sessions/${sessionId}/audio/synthesize`),
      {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      },
    );
    if (!response.ok) {
      const errorData = await parseApiError(
        response,
        `/career-profile/sessions/${sessionId}/audio/synthesize`,
      );
      throwApiError(response, errorData);
    }
    return response.arrayBuffer();
  },
};
