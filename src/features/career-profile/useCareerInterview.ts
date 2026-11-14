import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiError } from '@/services/api-errors';
import {
  useCancelCareerSessionMutation,
  useCareerProfileQuery,
  useCareerSessionQuery,
  useConfirmCareerProposalMutation,
  useCreateCareerSessionMutation,
  useSubmitCareerTurnMutation,
} from '@/features/career-profile/queries';
import type {
  CareerConfirmationDecision,
  CareerFactField,
  CareerSessionDetailResponse,
} from '@/types';

export const CAREER_INTERVIEW_MAX_MESSAGE_LENGTH = 4000;

const DRAFT_STORAGE_KEY = 'career-interview-draft';

export type CareerInterviewActionErrorKind = 'conflict' | 'agent' | 'auth' | 'generic';

export interface CareerInterviewActionError {
  kind: CareerInterviewActionErrorKind;
  message: string;
}

export const CAREER_FACT_FIELDS: CareerFactField[] = [
  'employer',
  'job_title',
  'start_date',
  'end_date',
  'responsibilities',
];

function classifyError(error: unknown): CareerInterviewActionErrorKind {
  if (error instanceof ApiError) {
    if (error.status === 409) return 'conflict';
    if (error.status === 502 || error.status === 503) return 'agent';
    if (error.status === 401) return 'auth';
  }
  return 'generic';
}

/**
 * Shared interview orchestration for the career profile interview.
 * One hook serves both the web split-screen layout (slice 3) and the mobile
 * chat-first layout (slice 4): conversation state, session version tracking,
 * idempotency keys, and the confirmation flow never fork by device.
 *
 * Session detail is the single source of truth: every mutation invalidates
 * the session query, and the UI reads messages, the pending proposal, and
 * the session version from the refetched detail. Turn responses are never
 * merged locally because they carry no facts map.
 */
export function useCareerInterview() {
  const [searchParams] = useSearchParams();
  // A resume import lands here with ?sessionId= so the interview opens
  // the import session (zero messages, pending proposal) instead of
  // starting a fresh session. Without the parameter the page behaves
  // exactly as before and starts a new session on mount.
  const initialSessionId = searchParams.get('sessionId');
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId);
  const [draft, setDraftState] = useState<string>(() => {
    try {
      return window.sessionStorage.getItem(DRAFT_STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [actionError, setActionError] = useState<CareerInterviewActionError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // One idempotency key per user send, kept stable across retries of the
  // same text. A changed text is a new intent and gets a fresh key.
  const pendingSendRef = useRef<{ key: string; text: string } | null>(null);
  const startAttemptedRef = useRef(false);

  const sessionQuery = useCareerSessionQuery(sessionId);
  const profileQuery = useCareerProfileQuery();

  const startMutation = useCreateCareerSessionMutation();
  const submitMutation = useSubmitCareerTurnMutation(sessionId ?? '');
  const confirmMutation = useConfirmCareerProposalMutation(sessionId ?? '');
  const cancelMutation = useCancelCareerSessionMutation(sessionId ?? '');

  // Keep the latest mutate function in a ref so the mount effect below
  // runs exactly once without depending on mutation object identity.
  const startMutateRef = useRef(startMutation.mutate);
  startMutateRef.current = startMutation.mutate;

  const startError = startMutation.error;
  const isStarting = startMutation.isPending && sessionId === null;

  const startSession = useCallback(() => {
    setActionError(null);
    startMutateRef.current(undefined, {
      onSuccess: (session) => setSessionId(session.sessionId),
    });
  }, []);

  useEffect(() => {
    if (startAttemptedRef.current || initialSessionId) return;
    startAttemptedRef.current = true;
    startSession();
  }, [startSession, initialSessionId]);

  const detail: CareerSessionDetailResponse | undefined = sessionQuery.data;
  const sessionVersion = detail?.sessionVersion ?? 0;
  const status = detail?.status ?? 'NOT_STARTED';
  const isTerminal = status === 'COMPLETED' || status === 'CANCELLED';
  const pendingProposal =
    detail?.pendingProposal && detail.pendingProposal.confirmationStatus === 'PENDING'
      ? detail.pendingProposal
      : null;
  const isSending = submitMutation.isPending;
  const isConfirming = confirmMutation.isPending;
  const isCancelling = cancelMutation.isPending;

  const setDraft = useCallback((value: string) => {
    setDraftState(value);
    try {
      if (value) {
        window.sessionStorage.setItem(DRAFT_STORAGE_KEY, value);
      } else {
        window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch {
      // Draft persistence is best effort; the composer still works without it.
    }
  }, []);

  const clearDraft = useCallback(() => {
    setDraftState('');
    try {
      window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Nothing to do when storage is unavailable.
    }
  }, []);

  const refetchSession = sessionQuery.refetch;
  const reportError = useCallback(
    (error: unknown, fallbackMessage: string) => {
      const kind = classifyError(error);
      if (kind === 'conflict') {
        void refetchSession();
      }
      setActionError({
        kind,
        message: error instanceof Error ? error.message : fallbackMessage,
      });
    },
    [refetchSession],
  );

  const send = useCallback(
    (text: string) => {
      const message = text.trim();
      if (!message || !sessionId || isTerminal || submitMutation.isPending) return;
      const pending = pendingSendRef.current;
      const idempotencyKey =
        pending && pending.text === message ? pending.key : crypto.randomUUID();
      pendingSendRef.current = { key: idempotencyKey, text: message };
      setActionError(null);
      submitMutation.mutate(
        { message, expectedSessionVersion: sessionVersion, idempotencyKey },
        {
          onSuccess: () => {
            pendingSendRef.current = null;
            clearDraft();
            setActionError(null);
          },
          onError: (error) => reportError(error, 'Unable to send message.'),
        },
      );
    },
    [sessionId, isTerminal, submitMutation, sessionVersion, clearDraft, reportError],
  );

  const retrySend = useCallback(() => {
    const pending = pendingSendRef.current;
    if (!pending || !sessionId || isTerminal || submitMutation.isPending) return;
    setIsRetrying(true);
    setActionError(null);
    submitMutation.mutate(
      {
        message: pending.text,
        expectedSessionVersion: sessionVersion,
        idempotencyKey: pending.key,
      },
      {
        onSuccess: () => {
          pendingSendRef.current = null;
          clearDraft();
          setActionError(null);
          setIsRetrying(false);
        },
        onError: (error) => {
          reportError(error, 'Unable to send message.');
          setIsRetrying(false);
        },
      },
    );
  }, [sessionId, isTerminal, submitMutation, sessionVersion, clearDraft, reportError]);

  const confirmProposal = useCallback(
    (
      proposalId: string,
      decision: CareerConfirmationDecision,
      editedFacts?: Record<string, string>,
    ) => {
      if (!sessionId || confirmMutation.isPending) return;
      setActionError(null);
      confirmMutation.mutate(
        { proposalId, decision, expectedSessionVersion: sessionVersion, editedFacts },
        {
          onSuccess: () => setActionError(null),
          onError: (error) => reportError(error, 'Unable to confirm proposal.'),
        },
      );
    },
    [sessionId, confirmMutation, sessionVersion, reportError],
  );

  const cancelSession = useCallback(() => {
    if (!sessionId || cancelMutation.isPending) return;
    setActionError(null);
    cancelMutation.mutate(
      { expectedSessionVersion: sessionVersion },
      {
        onError: (error) => reportError(error, 'Unable to cancel interview.'),
      },
    );
  }, [sessionId, cancelMutation, sessionVersion, reportError]);

  const retryStart = useCallback(() => {
    startAttemptedRef.current = false;
    startSession();
  }, [startSession]);

  return {
    sessionId,
    detail,
    status,
    isTerminal,
    pendingProposal,
    profile: profileQuery.data,
    isProfileLoading: profileQuery.isLoading,
    isStarting,
    startError,
    retryStart,
    draft,
    setDraft,
    send,
    retrySend,
    isSending,
    isRetrying,
    confirmProposal,
    isConfirming,
    cancelSession,
    isCancelling,
    actionError,
    clearActionError: () => setActionError(null),
    isSessionLoading: sessionQuery.isLoading,
    refetchSession: () => void sessionQuery.refetch(),
  };
}
