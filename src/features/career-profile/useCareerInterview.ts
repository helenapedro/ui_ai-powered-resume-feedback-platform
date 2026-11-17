import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiError } from '@/services/api-errors';
import { careerProfileService } from '@/services/career-profile';
import {
  useCancelCareerSessionMutation,
  useCareerProfileQuery,
  useCareerSessionQuery,
  useConfirmCareerProposalMutation,
  useCreateCareerSessionMutation,
  useSubmitCareerTurnMutation,
  useTranscribeCareerAudioMutation,
} from '@/features/career-profile/queries';
import type {
  CareerConfirmationDecision,
  CareerFactField,
  CareerSessionDetailResponse,
} from '@/types';

export const CAREER_INTERVIEW_MAX_MESSAGE_LENGTH = 4000;

/** The browser stop is the duration control; the server cap is 120 s / 10 MB. */
export const CAREER_VOICE_MAX_RECORD_SECONDS = 120;

const DRAFT_STORAGE_KEY = 'career-interview-draft';

export type CareerInterviewActionErrorKind =
  | 'conflict'
  | 'agent'
  | 'auth'
  | 'generic'
  | 'input'
  | 'voice';

export type CareerVoiceStatus = 'ready' | 'unsupported' | 'denied';

/**
 * Recording formats the Python transcribe endpoint accepts, in preference
 * order. The browser default is used when none of these is supported; a
 * format the server rejects surfaces as a correctable input error.
 */
const VOICE_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];

const VOICE_FILENAME_BY_MIME: Record<string, string> = {
  'audio/webm': 'audio.webm',
  'audio/mp4': 'audio.mp4',
  'audio/wav': 'audio.wav',
  'audio/x-wav': 'audio.wav',
  'audio/mpeg': 'audio.mp3',
};

function pickVoiceMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }
  return VOICE_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

function voiceFileName(mimeType: string): string {
  const base = mimeType.split(';')[0].trim();
  return VOICE_FILENAME_BY_MIME[base] ?? 'audio.webm';
}

/**
 * Minimal Web Speech API surface for live transcription. The DOM lib does
 * not declare SpeechRecognition, so only the members this slice uses are
 * typed here instead of pulling in a dependency.
 */
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

function speechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

/** Locale for live transcription: Portugal Portuguese, never Brazilian. */
function liveTranscriptionLocale(sessionLanguage: string | null): string {
  return sessionLanguage === 'pt' ? 'pt-PT' : 'en-US';
}

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  // True while the browser speech recognizer is feeding interim results
  // into the draft. False when the browser has no SpeechRecognition: the
  // recording still works, the transcript just lands after stop.
  const [isLiveTranscribing, setIsLiveTranscribing] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<CareerVoiceStatus>(() =>
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices?.getUserMedia === 'function' &&
    typeof MediaRecorder !== 'undefined'
      ? 'ready'
      : 'unsupported',
  );

  // One idempotency key per user send, kept stable across retries of the
  // same text. A changed text is a new intent and gets a fresh key.
  const pendingSendRef = useRef<{ key: string; text: string } | null>(null);
  const startAttemptedRef = useRef(false);

  // Live transcription pieces. The recognizer is separate from the
  // MediaRecorder: it only fills the draft while recording, and the
  // provider transcript still replaces the draft on stop.
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  // Draft text as it stood when recording started. Live results are
  // always rendered as base plus live text, so a new interim result
  // replaces the previous one instead of appending to it.
  const liveBaseRef = useRef('');
  const recognitionErrorRef = useRef(false);
  const isRecordingRef = useRef(false);

  // Voice recording pieces. The MediaRecorder lives here, in the hook,
  // because the composer is presentational: props in, callbacks out.
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recorderStreamRef = useRef<MediaStream | null>(null);
  const recorderChunksRef = useRef<Blob[]>([]);
  const recordingElapsedTimerRef = useRef<number | null>(null);
  const recordingStopTimerRef = useRef<number | null>(null);
  // The latest assistant reply already spoken. The baseline is the first
  // session detail observed: a reply present in it is history and is never
  // played, while a reply that arrives afterwards is spoken. The baseline
  // flag is separate from the id so a fresh session (zero messages at
  // first load) still speaks its first reply instead of treating it as
  // history.
  const playbackBaselineRef = useRef(false);
  const playedReplyIdRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const sessionQuery = useCareerSessionQuery(sessionId);
  const profileQuery = useCareerProfileQuery();

  const startMutation = useCreateCareerSessionMutation();
  const submitMutation = useSubmitCareerTurnMutation(sessionId ?? '');
  const confirmMutation = useConfirmCareerProposalMutation(sessionId ?? '');
  const cancelMutation = useCancelCareerSessionMutation(sessionId ?? '');
  const transcribeMutation = useTranscribeCareerAudioMutation(sessionId ?? '');

  // Keep the latest mutate function in a ref so the recorder's onstop
  // handler below always calls the current mutation without depending on
  // mutation object identity.
  const transcribeMutateRef = useRef(transcribeMutation.mutate);
  transcribeMutateRef.current = transcribeMutation.mutate;

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

  const clearRecordingTimers = useCallback(() => {
    if (recordingElapsedTimerRef.current !== null) {
      window.clearInterval(recordingElapsedTimerRef.current);
      recordingElapsedTimerRef.current = null;
    }
    if (recordingStopTimerRef.current !== null) {
      window.clearTimeout(recordingStopTimerRef.current);
      recordingStopTimerRef.current = null;
    }
  }, []);

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  /**
   * Synthesizes one assistant reply and plays it. Best effort: any failure
   * leaves the text on screen and never blocks the interview. Only the
   * latest reply is ever synthesized, never the whole history.
   */
  const playReply = useCallback(
    async (text: string) => {
      if (!sessionId || !text || text.length > CAREER_INTERVIEW_MAX_MESSAGE_LENGTH) return;
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      try {
        stopPlayback();
        const bytes = await careerProfileService.synthesizeAudio(sessionId, { text });
        const url = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => stopPlayback();
        audio.onerror = () => stopPlayback();
        await audio.play();
      } catch {
        // Best effort: the text reply stays on screen when playback fails.
        stopPlayback();
      }
    },
    [sessionId, stopPlayback],
  );

  /**
   * Stops live transcription, if any. Never throws and never reports an
   * error: a recognizer that cannot run is a silent fallback to the
   * transcript-after-stop behavior.
   */
  const stopLiveTranscription = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    setIsLiveTranscribing(false);
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    try {
      recognition.stop();
    } catch {
      // Already stopped; nothing to do.
    }
  }, []);

  /**
   * Starts browser speech recognition so the draft fills while the user
   * speaks. Interim results included: each result rebuilds the draft as
   * the text captured at recording start plus the live transcript, so a
   * corrected interim result replaces the previous guess instead of
   * appending to it. Any failure is silent: the provider transcript on
   * stop is still the source of truth and still lands in the draft.
   */
  const startLiveTranscription = useCallback(
    (sessionLanguage: string | null) => {
      const Recognition = speechRecognitionConstructor();
      if (!Recognition) return;
      try {
        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = liveTranscriptionLocale(sessionLanguage);
        recognitionErrorRef.current = false;
        recognition.onresult = (event) => {
          let liveText = '';
          for (let i = 0; i < event.results.length; i += 1) {
            const result = event.results[i];
            if (result && result.length > 0) {
              liveText += result[0].transcript;
            }
          }
          const base = liveBaseRef.current;
          const combined =
            base && liveText ? `${base} ${liveText}` : `${base}${liveText}`;
          setDraft(combined.slice(0, CAREER_INTERVIEW_MAX_MESSAGE_LENGTH));
        };
        // A failed recognizer must not spin: an error ends the attempt
        // instead of restarting it, and the recording carries on.
        recognition.onerror = () => {
          recognitionErrorRef.current = true;
        };
        recognition.onend = () => {
          if (!isRecordingRef.current || recognitionErrorRef.current) {
            setIsLiveTranscribing(false);
            return;
          }
          // Chrome can end recognition after a pause even with
          // continuous mode on, so restart it while still recording.
          try {
            recognitionErrorRef.current = false;
            recognition.start();
          } catch {
            setIsLiveTranscribing(false);
          }
        };
        recognitionRef.current = recognition;
        recognition.start();
        setIsLiveTranscribing(true);
      } catch {
        // SpeechRecognition unavailable or refused: silent fallback.
        recognitionRef.current = null;
        setIsLiveTranscribing(false);
      }
    },
    [setDraft],
  );

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    clearRecordingTimers();
    stopLiveTranscription();
    isRecordingRef.current = false;
    if (!recorder) {
      setIsRecording(false);
      return;
    }
    if (recorder.state !== 'inactive') {
      recorder.stop();
    }
    setIsRecording(false);
  }, [clearRecordingTimers, stopLiveTranscription]);

  const startRecording = useCallback(() => {
    if (!sessionId || isTerminal || isRecording || transcribeMutation.isPending) return;
    if (voiceStatus !== 'ready') return;
    setActionError(null);
    const mimeType = pickVoiceMimeType();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorderChunksRef.current = [];
        const recorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);
        recorderRef.current = recorder;
        recorderStreamRef.current = stream;
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recorderChunksRef.current.push(event.data);
          }
        };
        recorder.onstop = () => {
          const chunks = recorderChunksRef.current;
          recorderChunksRef.current = [];
          // Bare container type only: the transcribe endpoint matches
          // the part Content-Type against a bare allowlist
          // (audio/webm, audio/mp4, audio/mpeg, audio/wav), so the
          // codec parameter MediaRecorder reports
          // (audio/webm;codecs=opus) must not reach the server.
          const type = (mimeType ?? chunks[0]?.type ?? 'audio/webm')
            .split(';')[0]
            .trim();
          const audio = new Blob(chunks, { type });
          recorderStreamRef.current?.getTracks().forEach((track) => track.stop());
          recorderStreamRef.current = null;
          recorderRef.current = null;
          if (audio.size === 0) {
            setActionError({ kind: 'voice', message: '' });
            return;
          }
          transcribeMutateRef.current(
            { audio, filename: voiceFileName(type) },
            {
              onSuccess: (data) => {
                const transcript = data.transcript.trim();
                if (!transcript) {
                  // Distinct repair prompt: ask the candidate to repeat,
                  // not the generic extraction-failure text.
                  setActionError({ kind: 'voice', message: '' });
                  return;
                }
                setDraft(transcript.slice(0, CAREER_INTERVIEW_MAX_MESSAGE_LENGTH));
                setActionError(null);
              },
              onError: (error) => {
                // A 400 from the transcribe proxy is a browser-input
                // problem (empty, unsupported, or oversize audio), so it
                // is a correctable input error, not an agent failure.
                if (error instanceof ApiError && error.status === 400) {
                  setActionError({ kind: 'input', message: error.message });
                  return;
                }
                reportError(error, 'Unable to transcribe audio.');
              },
            },
          );
        };
        recorder.start();
        liveBaseRef.current = draft;
        isRecordingRef.current = true;
        setRecordingSeconds(0);
        setIsRecording(true);
        startLiveTranscription(detail?.language ?? null);
        recordingElapsedTimerRef.current = window.setInterval(() => {
          setRecordingSeconds((seconds) => seconds + 1);
        }, 1000);
        recordingStopTimerRef.current = window.setTimeout(() => {
          stopRecording();
        }, CAREER_VOICE_MAX_RECORD_SECONDS * 1000);
      })
      .catch((error: unknown) => {
        if (
          error instanceof DOMException &&
          (error.name === 'NotAllowedError' || error.name === 'SecurityError')
        ) {
          setVoiceStatus('denied');
        } else if (
          error instanceof DOMException &&
          (error.name === 'NotFoundError' || error.name === 'OverconstrainedError')
        ) {
          setVoiceStatus('unsupported');
        } else {
          reportError(error, 'Unable to start recording.');
        }
      });
  }, [sessionId, isTerminal, isRecording, transcribeMutation.isPending, voiceStatus, reportError, setDraft, stopRecording, startLiveTranscription, draft, detail]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Speak the latest assistant reply when it arrives. The baseline is the
  // first session detail observed: a reply already in it is history, never
  // played, and a refetch never replays the same reply.
  useEffect(() => {
    if (!detail) return;
    const messages = detail.messages ?? [];
    const latestAgent = [...messages]
      .filter((message) => message.role === 'AGENT')
      .sort((a, b) => b.sequence - a.sequence)[0];
    if (!playbackBaselineRef.current) {
      playbackBaselineRef.current = true;
      if (latestAgent) playedReplyIdRef.current = latestAgent.messageId;
      return;
    }
    if (!latestAgent) return;
    if (playedReplyIdRef.current === latestAgent.messageId) return;
    playedReplyIdRef.current = latestAgent.messageId;
    void playReply(latestAgent.content);
  }, [detail, playReply]);

  // Never leave a recorder, a recognizer, a stream, or an audio URL behind.
  useEffect(() => {
    return () => {
      clearRecordingTimers();
      stopLiveTranscription();
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = null;
        recorder.stop();
      }
      recorderStreamRef.current?.getTracks().forEach((track) => track.stop());
      stopPlayback();
    };
  }, [clearRecordingTimers, stopPlayback, stopLiveTranscription]);

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
    isRecording,
    recordingSeconds,
    isLiveTranscribing,
    isTranscribing: transcribeMutation.isPending,
    voiceStatus,
    toggleRecording,
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
