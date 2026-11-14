import { useMutation, useQuery } from '@tanstack/react-query';
import { careerProfileService } from '@/services/career-profile';
import { queryKeys } from '@/features/queries/keys';
import { useInvalidatingMutation } from '@/features/queries/useInvalidatingMutation';
import type {
  CareerCancelSessionRequest,
  CareerConfirmProposalRequest,
  CareerResumeImportRequest,
  CareerSubmitTurnRequest,
} from '@/types';

export function useCareerProfileQuery() {
  return useQuery({
    queryKey: queryKeys.careerProfile.profile,
    queryFn: () => careerProfileService.getProfile(),
  });
}

export function useCareerSessionQuery(sessionId: string | null) {
  return useQuery({
    queryKey: queryKeys.careerProfile.session(sessionId ?? ''),
    queryFn: () => careerProfileService.getSession(sessionId ?? ''),
    enabled: sessionId !== null,
  });
}

export function useCreateCareerSessionMutation() {
  return useMutation({
    mutationFn: () => careerProfileService.createSession(),
  });
}

export function useImportResumeToCareerProfileMutation() {
  return useMutation({
    mutationFn: (request: CareerResumeImportRequest) =>
      careerProfileService.importFromResume(request),
  });
}

export function useSubmitCareerTurnMutation(sessionId: string) {
  return useInvalidatingMutation({
    mutationFn: (request: CareerSubmitTurnRequest) =>
      careerProfileService.submitTurn(sessionId, request),
    getQueryKeys: () => [queryKeys.careerProfile.session(sessionId)],
  });
}

export function useConfirmCareerProposalMutation(sessionId: string) {
  return useInvalidatingMutation({
    mutationFn: (request: CareerConfirmProposalRequest) =>
      careerProfileService.confirmProposal(sessionId, request),
    getQueryKeys: () => [
      queryKeys.careerProfile.session(sessionId),
      queryKeys.careerProfile.profile,
    ],
  });
}

export function useCancelCareerSessionMutation(sessionId: string) {
  return useInvalidatingMutation({
    mutationFn: (request: CareerCancelSessionRequest) =>
      careerProfileService.cancelSession(sessionId, request),
    getQueryKeys: () => [queryKeys.careerProfile.session(sessionId)],
  });
}
