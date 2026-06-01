import { useAiReviewState } from '@/features/ai/useAiReviewState';
import { getFeedbackStatusConfig } from '@/components/ai-feedback/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { FeedbackCardShell } from '@/components/ai-feedback/FeedbackCardShell';
import { FeedbackCompletedView } from '@/components/ai-feedback/FeedbackCompletedView';
import { ProgressReviewCard } from '@/components/ai-feedback/ProgressReviewCard';
import {
  FeedbackLoadingState,
  FeedbackMessageState,
  FeedbackProcessingState,
} from '@/components/ai-feedback/FeedbackStates';
import type { ResumeVersion } from '@/types';

interface AiFeedbackProps {
  resumeId: string;
  versionId: string;
  versionNumber: number;
  versions: ResumeVersion[];
}

export function AiFeedback({ resumeId, versionId, versionNumber, versions }: AiFeedbackProps) {
  const { language, t } = useLanguage();
  const reviewState = useAiReviewState(
    resumeId,
    versionId,
    versionNumber > 1
  );
  const { job, feedback, isFeedbackUnavailable, isLoading, feedbackError, isRegenerating, handleRegenerate } = reviewState;
  const baselineVersionNumber = versions.find(
    (version) => version.id === reviewState.progress?.baselineResumeVersionId
  )?.versionNumber;
  const feedbackStatusConfig = getFeedbackStatusConfig(language);

  if (isLoading) {
    return (
      <FeedbackCardShell>
        <FeedbackLoadingState />
      </FeedbackCardShell>
    );
  }

  if (!job) {
    return (
      <FeedbackCardShell>
        <FeedbackMessageState
          eyebrow={t('feedback.noAnalysisEyebrow')}
          title={t('feedback.noAnalysisTitle')}
          description={t('feedback.noAnalysisDescription')}
          action={{
            label: t('feedback.generate'),
            onClick: handleRegenerate,
            disabled: isRegenerating,
            loading: isRegenerating,
            variant: 'default',
          }}
        />
      </FeedbackCardShell>
    );
  }

  const status = feedbackStatusConfig[job.status] ?? feedbackStatusConfig.PENDING;
  const canRegenerate = job.status === 'DONE' || job.status === 'FAILED';
  const isLegacyFeedback = Boolean(feedback && (!feedback.promptVersion || feedback.promptVersion < 'v3'));

  return (
    <FeedbackCardShell
      status={status}
      action={
        canRegenerate
          ? {
              label: t('feedback.regenerate'),
              onClick: handleRegenerate,
              disabled: isRegenerating,
              loading: isRegenerating,
              variant: 'outline',
            }
          : undefined
      }
    >
      {isLegacyFeedback && (
        <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
          {t('feedback.legacy')}
        </div>
      )}

      <ProgressReviewCard
        baselineVersionNumber={baselineVersionNumber}
        currentVersionNumber={versionNumber}
        error={reviewState.progressError}
        hasPreviousVersion={reviewState.hasPreviousVersion}
        isPending={reviewState.isProgressPending}
        isUnavailable={reviewState.isProgressUnavailable}
        progress={reviewState.progress}
      />

      {(job.status === 'PENDING' || job.status === 'PROCESSING') && <FeedbackProcessingState />}

      {feedbackError && job.status === 'FAILED' && (
        <FeedbackMessageState
          eyebrow={t('feedback.failedEyebrow')}
          title={t('feedback.failedTitle')}
          description={feedbackError}
          tone="destructive"
          action={{
            label: t('feedback.tryAgain'),
            onClick: handleRegenerate,
            disabled: isRegenerating,
            loading: isRegenerating,
          }}
        />
      )}

      {feedbackError && job.status !== 'FAILED' && (
        <FeedbackMessageState
          eyebrow={t('feedback.interruptedEyebrow')}
          title={t('feedback.interruptedTitle')}
          description={feedbackError}
          action={{
            label: t('feedback.reload'),
            onClick: handleRegenerate,
            disabled: isRegenerating,
            loading: isRegenerating,
            variant: 'outline',
          }}
        />
      )}

      {feedback && job.status === 'DONE' && (
        <FeedbackCompletedView feedback={feedback} versionNumber={versionNumber} />
      )}

      {!feedback && job.status === 'DONE' && isFeedbackUnavailable && (
        <FeedbackMessageState
          eyebrow={t('feedback.pendingEyebrow')}
          title={t('feedback.pendingTitle')}
          description={t('feedback.pendingDescription')}
        />
      )}

      {!feedback && job.status === 'DONE' && !feedbackError && !isFeedbackUnavailable && (
        <FeedbackMessageState
          eyebrow={t('feedback.emptyEyebrow')}
          title={t('feedback.emptyTitle')}
          description={t('feedback.emptyDescription')}
        />
      )}
    </FeedbackCardShell>
  );
}
