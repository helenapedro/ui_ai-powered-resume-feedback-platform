import { ArrowUpRight, CheckCircle2, ThumbsUp } from 'lucide-react';
import type { AiFeedbackDTO } from '@/types';
import { Badge } from '@/components/ui/badge';
import { FeedbackEmptyList } from '@/components/ai-feedback/FeedbackEmptyList';
import { FeedbackItem } from '@/components/ai-feedback/FeedbackItem';
import { FeedbackSection } from '@/components/ai-feedback/FeedbackSection';
import { parseFeedbackItem } from '@/components/ai-feedback/utils';

interface FeedbackCompletedViewProps {
  feedback: AiFeedbackDTO;
  versionNumber: number;
}

export function FeedbackCompletedView({ feedback, versionNumber }: FeedbackCompletedViewProps) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-[linear-gradient(135deg,hsl(var(--primary)/0.12),transparent_58%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary/75">
              Feedback for v{versionNumber}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Overall Assessment
            </p>
            <p className="text-base leading-8 text-foreground/80 sm:text-lg">{feedback.summary}</p>
          </div>

          <div className="grid gap-3 sm:min-w-[220px]">
            <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Strength signals
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{feedback.strengths.length}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Gaps to close
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{feedback.improvements.length}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <FeedbackSection
          eyebrow="AI Feedback"
          title="Strength Signals"
          description="These are the parts already helping the current version read clearly and credibly."
          icon={<ThumbsUp className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />}
          accentClassName="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40"
        >
          {feedback.strengths.length > 0 ? (
            <ul className="space-y-3">
              {feedback.strengths.map((item, index) => (
                <FeedbackItem
                  key={`${item}-${index}`}
                  item={item}
                  icon={<CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                  containerClassName="border-emerald-100 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                  labelClassName="border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-200"
                />
              ))}
            </ul>
          ) : (
            <FeedbackEmptyList message="No specific strengths were returned for this version yet." />
          )}
        </FeedbackSection>

        <FeedbackSection
          eyebrow="AI Feedback"
          title="Gaps to Close"
          description="Treat these as the highest-leverage changes for the current version."
          icon={<ArrowUpRight className="h-5 w-5 text-amber-700 dark:text-amber-300" />}
          accentClassName="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40"
        >
          {feedback.improvements.length > 0 ? (
            <ul className="space-y-3">
              {feedback.improvements.map((item, index) => {
                const parsed = parseFeedbackItem(item);

                return (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20"
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800 dark:bg-amber-950/70 dark:text-amber-200">
                        {index + 1}
                      </div>
                      <div className="min-w-0 space-y-2">
                        {parsed.label && (
                          <Badge
                            variant="secondary"
                            className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/60 dark:text-amber-200"
                          >
                            {parsed.label}
                          </Badge>
                        )}
                        <p className="text-sm leading-6 text-foreground/86">{parsed.content}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <FeedbackEmptyList message="No improvement items were returned for this version yet." />
          )}
        </FeedbackSection>
      </div>
    </div>
  );
}
