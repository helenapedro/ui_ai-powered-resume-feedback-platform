import { useAiReviewState } from '@/features/ai/useAiReviewState';
import { feedbackStatusConfig } from '@/components/ai-feedback/constants';
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
  const reviewState = useAiReviewState(
    resumeId,
    versionId,
    versionNumber > 1
  );
  const { job, feedback, isFeedbackUnavailable, isLoading, feedbackError, isRegenerating, handleRegenerate } = reviewState;
  const baselineVersionNumber = versions.find(
    (version) => version.id === reviewState.progress?.baselineResumeVersionId
  )?.versionNumber;

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
          eyebrow="No analysis yet"
          title="Generate a recruiter-style review"
          description="Create an executive summary, highlight what already works, and surface the highest-leverage gaps."
          action={{
            label: 'Generate Feedback',
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
              label: 'Regenerate',
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
          This review uses an older feedback format. Regenerate to get the latest English-only review.
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
          eyebrow="Review Failed"
          title="The feedback run did not complete"
          description={feedbackError}
          tone="destructive"
          action={{
            label: 'Try Again',
            onClick: handleRegenerate,
            disabled: isRegenerating,
            loading: isRegenerating,
          }}
        />
      )}

      {feedbackError && job.status !== 'FAILED' && (
        <FeedbackMessageState
          eyebrow="Review Interrupted"
          title="The latest feedback could not be loaded"
          description={feedbackError}
          action={{
            label: 'Reload Review',
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
          eyebrow="AI Review Pending"
          title="AI review is still being generated"
          description="The job has completed, but the latest review document is not available yet. Try refreshing in a moment."
        />
      )}

      {!feedback && job.status === 'DONE' && !feedbackError && !isFeedbackUnavailable && (
        <FeedbackMessageState
          eyebrow="No Feedback"
          title="The review completed without displayable content"
          description="Regenerate the analysis to request a fresh recruiter-style pass on this version."
        />
      )}
    </FeedbackCardShell>
  );
}
