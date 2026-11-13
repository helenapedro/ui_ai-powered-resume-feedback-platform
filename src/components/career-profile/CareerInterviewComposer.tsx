import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { CAREER_INTERVIEW_MAX_MESSAGE_LENGTH } from '@/features/career-profile/useCareerInterview';

interface CareerInterviewComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  disabled: boolean;
  isSending: boolean;
}

export function CareerInterviewComposer({
  value,
  onChange,
  onSend,
  disabled,
  isSending,
}: CareerInterviewComposerProps) {
  const { t } = useLanguage();
  const canSend = value.trim().length > 0 && !disabled && !isSending;

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
        <Button onClick={handleSend} disabled={!canSend} size="sm">
          <Send className="mr-2 h-4 w-4" />
          {isSending ? t('careerInterview.sending') : t('careerInterview.send')}
        </Button>
      </div>
    </div>
  );
}
