import { Loader2, Mic, Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  CAREER_INTERVIEW_MAX_MESSAGE_LENGTH,
  CAREER_VOICE_MAX_RECORD_SECONDS,
  type CareerVoiceStatus,
} from '@/features/career-profile/useCareerInterview';

interface CareerInterviewComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  disabled: boolean;
  isSending: boolean;
  isRecording: boolean;
  recordingSeconds: number;
  isLiveTranscribing: boolean;
  isTranscribing: boolean;
  voiceStatus: CareerVoiceStatus;
  onToggleRecording: () => void;
}

function formatRecordingTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function CareerInterviewComposer({
  value,
  onChange,
  onSend,
  disabled,
  isSending,
  isRecording,
  recordingSeconds,
  isLiveTranscribing,
  isTranscribing,
  voiceStatus,
  onToggleRecording,
}: CareerInterviewComposerProps) {
  const { t } = useLanguage();
  const canSend = value.trim().length > 0 && !disabled && !isSending;
  const canUseVoice = voiceStatus === 'ready' && !disabled && !isTranscribing;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value);
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={t('careerInterview.sendPlaceholder')}
        value={value}
        maxLength={CAREER_INTERVIEW_MAX_MESSAGE_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
          }
        }}
        disabled={disabled || isSending}
        className="min-h-[80px]"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {value.length} / {CAREER_INTERVIEW_MAX_MESSAGE_LENGTH}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isRecording ? 'destructive' : 'outline'}
            onClick={onToggleRecording}
            disabled={!canUseVoice && !isRecording}
            size="sm"
            aria-label={
              isRecording
                ? t('careerInterview.voiceStopRecording')
                : t('careerInterview.voiceMic')
            }
          >
            {isRecording ? (
              <Square className="mr-2 h-4 w-4" />
            ) : (
              <Mic className="mr-2 h-4 w-4" />
            )}
            {isRecording
              ? t('careerInterview.voiceStopRecording')
              : t('careerInterview.voiceMic')}
          </Button>
          <Button onClick={handleSend} disabled={!canSend} size="sm">
            <Send className="mr-2 h-4 w-4" />
            {isSending ? t('careerInterview.sending') : t('careerInterview.send')}
          </Button>
        </div>
      </div>
      {isRecording ? (
        <p className="text-xs text-muted-foreground" role="status">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-destructive" />
          {t('careerInterview.voiceRecording')} {formatRecordingTime(recordingSeconds)} /{' '}
          {formatRecordingTime(CAREER_VOICE_MAX_RECORD_SECONDS)}
        </p>
      ) : null}
      {isRecording && isLiveTranscribing ? (
        <p className="text-xs text-muted-foreground" role="status">
          {t('careerInterview.voiceLiveTranscribing')}
        </p>
      ) : null}
      {isTranscribing ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
          <Loader2 className="h-3 w-3 animate-spin" />
          {t('careerInterview.voiceTranscribing')}
        </p>
      ) : null}
      {voiceStatus !== 'ready' && !isRecording && !isTranscribing ? (
        <p className="text-xs text-muted-foreground">
          {voiceStatus === 'denied'
            ? t('careerInterview.voiceUnavailableDenied')
            : t('careerInterview.voiceUnavailableUnsupported')}
        </p>
      ) : null}
    </div>
  );
}
