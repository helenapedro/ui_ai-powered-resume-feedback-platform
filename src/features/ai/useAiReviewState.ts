import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  useAiFeedbackQuery,
  useAiProgressQuery,
  useLatestAiJobQuery,
  useRegenerateAiFeedbackMutation,
} from '@/features/ai/queries';

const POLL_TIMEOUT = 120000;

export function useAiReviewState(resumeId: string, versionId: string, hasPreviousVersion: boolean) {
  const { t } = useLanguage();
  const [timeoutError, setTimeoutError] = useState<string | null>(null);
  const jobQuery = useLatestAiJobQuery(resumeId, versionId);
  const job = jobQuery.data ?? null;
  const feedbackQuery = useAiFeedbackQuery(resumeId, versionId, job?.status === 'DONE');
  const progressQuery = useAiProgressQuery(
    resumeId,
    versionId,
    hasPreviousVersion && job?.status === 'DONE'
  );
  const regenerateMutation = useRegenerateAiFeedbackMutation(resumeId, versionId);

  const isFeedbackUnavailable = feedbackQuery.error instanceof ApiError && feedbackQuery.error.status === 404;
  const isProgressUnavailable = progressQuery.error instanceof ApiError && progressQuery.error.status === 404;
  const isProgressPending = hasPreviousVersion && (job?.status === 'PENDING' || job?.status === 'PROCESSING');

  useEffect(() => {
    setTimeoutError(null);
  }, [resumeId, versionId]);

  useEffect(() => {
    if (job?.status !== 'PENDING' && job?.status !== 'PROCESSING') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTimeoutError(t('feedback.timeout'));
    }, POLL_TIMEOUT);

    return () => window.clearTimeout(timeoutId);
  }, [job?.id, job?.status, t]);

  const handleRegenerate = useCallback(async () => {
    setTimeoutError(null);
    await regenerateMutation.mutateAsync();
  }, [regenerateMutation]);

  const feedbackError = useMemo(() => {
    if (timeoutError) {
      return timeoutError;
    }

    if (job?.status === 'FAILED') {
      return job.errorDetail || t('feedback.failedDefault');
    }

    if (feedbackQuery.error && !isFeedbackUnavailable) {
      return t('feedback.loadError');
    }

    if (jobQuery.error && !job) {
      return null;
    }

    if (regenerateMutation.error) {
      return t('feedback.regenerateError');
    }

    return null;
  }, [feedbackQuery.error, isFeedbackUnavailable, job, jobQuery.error, regenerateMutation.error, t, timeoutError]);

  const progressError = useMemo(() => {
    if (!hasPreviousVersion || isProgressUnavailable) {
      return null;
    }

    if (progressQuery.error) {
      return t('feedback.progressUnavailable');
    }

    return null;
  }, [hasPreviousVersion, isProgressUnavailable, progressQuery.error, t]);

  return {
    job,
    feedback: feedbackQuery.data ?? null,
    progress: progressQuery.data ?? null,
    isFeedbackUnavailable,
    isProgressUnavailable,
    isProgressPending,
    isLoading: jobQuery.isLoading && !job,
    feedbackError,
    progressError,
    hasPreviousVersion,
    isRegenerating: regenerateMutation.isPending,
    handleRegenerate,
  };
}
