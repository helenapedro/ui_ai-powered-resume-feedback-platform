import { useAiFeedback } from '@/features/ai/useAiFeedback';
import { feedbackStatusConfig } from '@/components/ai-feedback/constants';
import { FeedbackCardShell } from '@/components/ai-feedback/FeedbackCardShell';
import { FeedbackCompletedView } from '@/components/ai-feedback/FeedbackCompletedView';
import {
  FeedbackLoadingState,
  FeedbackMessageState,
  FeedbackProcessingState,
} from '@/components/ai-feedback/FeedbackStates';

interface AiFeedbackProps {
  resumeId: string;
  versionId: string;
}

export function AiFeedback({ resumeId, versionId }: AiFeedbackProps) {
  const { job, feedback, isLoading, error, isRegenerating, handleRegenerate } = useAiFeedback(
    resumeId,
    versionId
  );

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
      {(job.status === 'PENDING' || job.status === 'PROCESSING') && <FeedbackProcessingState />}

      {error && job.status === 'FAILED' && (
        <FeedbackMessageState
          eyebrow="Review Failed"
          title="The feedback run did not complete"
          description={error}
          tone="destructive"
          action={{
            label: 'Try Again',
            onClick: handleRegenerate,
            disabled: isRegenerating,
            loading: isRegenerating,
          }}
        />
      )}

      {error && job.status !== 'FAILED' && (
        <FeedbackMessageState
          eyebrow="Review Interrupted"
          title="The latest feedback could not be loaded"
          description={error}
          action={{
            label: 'Reload Review',
            onClick: handleRegenerate,
            disabled: isRegenerating,
            loading: isRegenerating,
            variant: 'outline',
          }}
        />
      )}

      {feedback && job.status === 'DONE' && <FeedbackCompletedView feedback={feedback} />}

      {!feedback && job.status === 'DONE' && !error && (
        <FeedbackMessageState
          eyebrow="No Feedback"
          title="The review completed without displayable content"
          description="Regenerate the analysis to request a fresh recruiter-style pass on this version."
        />
      )}
    </FeedbackCardShell>
  );
}
