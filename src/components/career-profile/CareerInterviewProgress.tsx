import { Badge } from '@/components/ui/badge';
import { useLanguage, type TranslationKey } from '@/contexts/LanguageContext';
import type { CareerSessionStatus } from '@/types';

const STATUS_LABEL_KEYS: Record<CareerSessionStatus, TranslationKey> = {
  NOT_STARTED: 'careerInterview.statusNotStarted',
  IN_PROGRESS: 'careerInterview.statusInProgress',
  AWAITING_CONFIRMATION: 'careerInterview.statusAwaitingConfirmation',
  COMPLETED: 'careerInterview.statusCompleted',
  CANCELLED: 'careerInterview.statusCancelled',
};

interface CareerInterviewProgressProps {
  confirmedCount: number;
  status: CareerSessionStatus;
}

/**
 * Light progress indicator for the interview: how many jobs are confirmed
 * so far, plus the current session state. There is no total number of jobs
 * to count against, so no fake denominator is shown.
 */
export function CareerInterviewProgress({ confirmedCount, status }: CareerInterviewProgressProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">
        {t('careerInterview.progressConfirmed', { count: confirmedCount })}
      </Badge>
      <Badge variant="outline">{t(STATUS_LABEL_KEYS[status])}</Badge>
    </div>
  );
}
