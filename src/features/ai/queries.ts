import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiService } from '@/services/ai';
import { queryKeys } from '@/features/queries/keys';

const POLL_INTERVAL = 3000;

export function useLatestAiJobQuery(resumeId: string, versionId: string) {
  return useQuery({
    queryKey: queryKeys.resumes.aiJob(resumeId, versionId),
    queryFn: () => aiService.getLatestJob(resumeId, versionId),
    enabled: Boolean(resumeId && versionId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? POLL_INTERVAL : false;
    },
  });
}

export function useAiFeedbackQuery(resumeId: string, versionId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.resumes.aiFeedback(resumeId, versionId),
    queryFn: () => aiService.getFeedback(resumeId, versionId),
    enabled: Boolean(resumeId && versionId && enabled),
  });
}

export function useRegenerateAiFeedbackMutation(resumeId: string, versionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => aiService.regenerate(resumeId, versionId),
    onSuccess: () => {
      void queryClient.removeQueries({
        queryKey: queryKeys.resumes.aiFeedback(resumeId, versionId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.aiJob(resumeId, versionId),
      });
    },
  });
}
