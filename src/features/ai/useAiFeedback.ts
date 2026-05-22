import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '@/services/api';
import {
  useAiFeedbackQuery,
  useLatestAiJobQuery,
  useRegenerateAiFeedbackMutation,
} from '@/features/ai/queries';

const POLL_TIMEOUT = 120000;

export function useAiFeedback(resumeId: string, versionId: string) {
  const [timeoutError, setTimeoutError] = useState<string | null>(null);
  const jobQuery = useLatestAiJobQuery(resumeId, versionId);
  const job = jobQuery.data ?? null;
  const feedbackQuery = useAiFeedbackQuery(resumeId, versionId, job?.status === 'DONE');
  const regenerateMutation = useRegenerateAiFeedbackMutation(resumeId, versionId);
  const isFeedbackUnavailable = feedbackQuery.error instanceof ApiError && feedbackQuery.error.status === 404;

  useEffect(() => {
    setTimeoutError(null);
  }, [resumeId, versionId]);

  useEffect(() => {
    if (job?.status !== 'PENDING' && job?.status !== 'PROCESSING') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTimeoutError('The AI review timed out. Try regenerating the review.');
    }, POLL_TIMEOUT);

    return () => window.clearTimeout(timeoutId);
  }, [job?.id, job?.status]);

  const handleRegenerate = useCallback(async () => {
    setTimeoutError(null);
    await regenerateMutation.mutateAsync();
  }, [regenerateMutation]);

  const error = useMemo(() => {
    if (timeoutError) {
      return timeoutError;
    }

    if (job?.status === 'FAILED') {
      return job.errorDetail || 'The AI review failed.';
    }

    if (feedbackQuery.error && !isFeedbackUnavailable) {
      return 'Unable to load AI feedback.';
    }

    if (jobQuery.error && !job) {
      return null;
    }

    if (regenerateMutation.error) {
      return 'Unable to regenerate AI feedback.';
    }

    return null;
  }, [feedbackQuery.error, isFeedbackUnavailable, job, jobQuery.error, regenerateMutation.error, timeoutError]);

  return {
    job,
    feedback: feedbackQuery.data ?? null,
    isFeedbackUnavailable,
    isLoading: jobQuery.isLoading && !job,
    error,
    isRegenerating: regenerateMutation.isPending,
    handleRegenerate,
  };
}
