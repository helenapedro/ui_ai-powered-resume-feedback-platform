import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAiFeedback,
  fetchLatestAiJob,
  regenerateAiFeedback,
  resetAiFeedbackEntry,
  selectAiFeedbackEntry,
  setAiFeedbackError,
  setAiFeedbackLoading,
} from '@/store/slices/aiFeedbackSlice';

const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 120000;

export function useAiFeedback(resumeId: string, versionId: string) {
  const dispatch = useAppDispatch();
  const entry = useAppSelector((state) => selectAiFeedbackEntry(state, resumeId, versionId));
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const fetchFeedback = useCallback(async () => {
    await dispatch(fetchAiFeedback({ resumeId, versionId })).unwrap();
  }, [dispatch, resumeId, versionId]);

  const pollJob = useCallback(async () => {
    try {
      const { job } = await dispatch(fetchLatestAiJob({ resumeId, versionId })).unwrap();

      if (job.status === 'DONE') {
        stopPolling();
        await fetchFeedback();
      } else if (job.status === 'FAILED') {
        stopPolling();
      }
    } catch {
      stopPolling();
      dispatch(setAiFeedbackLoading({ resumeId, versionId, isLoading: false }));
    }
  }, [dispatch, fetchFeedback, resumeId, stopPolling, versionId]);

  const startPolling = useCallback(() => {
    stopPolling();
    dispatch(setAiFeedbackError({ resumeId, versionId, error: null }));

    void pollJob();

    pollingRef.current = setInterval(() => {
      void pollJob();
    }, POLL_INTERVAL);

    timeoutRef.current = setTimeout(() => {
      stopPolling();
      dispatch(
        setAiFeedbackError({
          resumeId,
          versionId,
          error: 'Tempo limite atingido. Tente regenerar o feedback.',
        })
      );
    }, POLL_TIMEOUT);
  }, [dispatch, pollJob, resumeId, stopPolling, versionId]);

  useEffect(() => {
    dispatch(resetAiFeedbackEntry({ resumeId, versionId }));

    const init = async () => {
      try {
        const { job } = await dispatch(fetchLatestAiJob({ resumeId, versionId })).unwrap();

        if (job.status === 'DONE') {
          await fetchFeedback();
        } else if (job.status !== 'FAILED') {
          startPolling();
        }
      } catch {
        dispatch(setAiFeedbackLoading({ resumeId, versionId, isLoading: false }));
      }
    };

    void init();

    return stopPolling;
  }, [dispatch, fetchFeedback, resumeId, startPolling, stopPolling, versionId]);

  const handleRegenerate = useCallback(async () => {
    try {
      await dispatch(regenerateAiFeedback({ resumeId, versionId })).unwrap();
      startPolling();
    } catch {
      return;
    }
  }, [dispatch, resumeId, startPolling, versionId]);

  return {
    ...entry,
    handleRegenerate,
  };
}
