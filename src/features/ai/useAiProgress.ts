import { useMemo } from 'react';
import { ApiError } from '@/services/api';
import { useAiProgressQuery, useLatestAiJobQuery } from '@/features/ai/queries';

export function useAiProgress(resumeId: string, versionId: string, hasPreviousVersion: boolean) {
  const jobQuery = useLatestAiJobQuery(resumeId, versionId);
  const job = jobQuery.data ?? null;
  const progressQuery = useAiProgressQuery(
    resumeId,
    versionId,
    hasPreviousVersion && job?.status === 'DONE'
  );

  const isPending = hasPreviousVersion && (job?.status === 'PENDING' || job?.status === 'PROCESSING');
  const isUnavailable = progressQuery.error instanceof ApiError && progressQuery.error.status === 404;

  const error = useMemo(() => {
    if (!hasPreviousVersion || isUnavailable) {
      return null;
    }

    if (progressQuery.error) {
      return 'Progress comparison is not available right now.';
    }

    return null;
  }, [hasPreviousVersion, isUnavailable, progressQuery.error]);

  return {
    job,
    progress: progressQuery.data ?? null,
    isPending,
    isUnavailable,
    error,
    hasPreviousVersion,
  };
}
