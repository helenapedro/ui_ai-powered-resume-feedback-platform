import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAiFeedback } from '@/features/ai/useAiFeedback';
import {
  Brain,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ThumbsUp,
  AlertTriangle,
  ArrowUpRight,
  ScanSearch,
} from 'lucide-react';

interface AiFeedbackProps {
  resumeId: string;
  versionId: string;
}

interface ParsedFeedbackItem {
  label: string | null;
  content: string;
}

function parseFeedbackItem(item: string): ParsedFeedbackItem {
  const separatorIndex = item.indexOf(':');

  if (separatorIndex <= 0) {
    return { label: null, content: item.trim() };
  }

  const label = item.slice(0, separatorIndex).trim();
  const content = item.slice(separatorIndex + 1).trim();

  if (!content || label.length > 28 || !/^[A-Za-z][A-Za-z\s/&-]*$/.test(label)) {
    return { label: null, content: item.trim() };
  }

  return { label, content };
}

function FeedbackItem({
  item,
  icon,
  labelClassName,
  containerClassName,
  contentClassName,
}: {
  item: string;
  icon: ReactNode;
  labelClassName: string;
  containerClassName?: string;
  contentClassName?: string;
}) {
  const parsed = parseFeedbackItem(item);

  return (
    <li
      className={cn(
        'flex gap-3 rounded-2xl border px-4 py-4 shadow-sm backdrop-blur-sm',
        'transition-colors duration-200',
        containerClassName
      )}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 space-y-2">
        {parsed.label && (
          <Badge
            variant="secondary"
            className={cn(
              'rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
              labelClassName
            )}
          >
            {parsed.label}
          </Badge>
        )}
        <p className={cn('text-sm leading-6 text-foreground/86', contentClassName)}>{parsed.content}</p>
      </div>
    </li>
  );
}

function FeedbackSection({
  eyebrow,
  title,
  description,
  icon,
  children,
  accentClassName,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  accentClassName: string;
}) {
  return (
    <section className="space-y-5 rounded-[1.75rem] border border-border/70 bg-background/85 p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-4">
        <div className={cn('rounded-2xl border p-3 shadow-sm', accentClassName)}>{icon}</div>
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p>
          <h3 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function AiFeedback({ resumeId, versionId }: AiFeedbackProps) {
  const { job, feedback, isLoading, error, isRegenerating, handleRegenerate } = useAiFeedback(
    resumeId,
    versionId
  );

  const statusConfig: Record<string, { icon: ReactNode; label: string; color: string }> = {
    PENDING: {
      icon: <Clock className="h-4 w-4" />,
      label: 'Queued',
      color: 'border-border bg-background/80 text-muted-foreground',
    },
    PROCESSING: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      label: 'Analyzing',
      color: 'border-primary/15 bg-primary/10 text-primary',
    },
    DONE: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Ready',
      color: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    FAILED: {
      icon: <XCircle className="h-4 w-4" />,
      label: 'Needs retry',
      color: 'border-destructive/20 bg-destructive/10 text-destructive',
    },
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-muted/30 shadow-lg">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-primary/15 bg-primary/10 p-3">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-44" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <Skeleton className="h-28 w-full rounded-[1.5rem]" />
          <div className="grid gap-4 xl:grid-cols-2">
            <Skeleton className="h-40 w-full rounded-[1.5rem]" />
            <Skeleton className="h-40 w-full rounded-[1.5rem]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-background via-background to-muted/30 shadow-lg">
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-primary/15 bg-primary/10 p-3">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Recruiter Review
              </p>
              <CardTitle className="text-xl sm:text-2xl">AI Feedback</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-[1.75rem] border border-dashed border-border/80 bg-background/80 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  No analysis yet
                </p>
                <h3 className="text-2xl font-semibold text-foreground">Generate a recruiter-style review</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Create an executive summary, highlight what already works, and surface the highest-leverage gaps.
                </p>
              </div>
              <Button onClick={handleRegenerate} disabled={isRegenerating} size="sm" className="sm:min-w-44">
                {isRegenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Generate Feedback
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = statusConfig[job.status] || statusConfig.PENDING;

  return (
    <Card className="overflow-hidden border-border/60 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.08),_transparent_32%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.28))] shadow-lg">
      <CardHeader className="gap-5 border-b border-border/60 bg-background/80 pb-6 backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-primary/15 bg-primary/10 p-3 shadow-sm">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Recruiter Review
                </p>
                <CardTitle className="text-xl sm:text-2xl">AI Feedback</CardTitle>
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              A structured read on current positioning, what is already credible, and the gaps most likely to affect
              recruiter confidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn('rounded-full border px-3 py-1 text-xs font-medium', status.color)}>
              {status.icon}
              <span className="ml-2">{status.label}</span>
            </Badge>
            {(job.status === 'DONE' || job.status === 'FAILED') && (
              <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isRegenerating}>
                {isRegenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {(job.status === 'PENDING' || job.status === 'PROCESSING') && (
          <div className="rounded-[1.75rem] border border-border/70 bg-background/85 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  In Progress
                </p>
                <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  Reviewing this resume like a recruiter would
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  The model is evaluating positioning, evidence quality, skills coverage, and whether the resume reads
                  at the level it is aiming for.
                </p>
              </div>

              <div className="flex min-w-[220px] items-center gap-4 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">Building feedback</p>
                  <p className="text-xs leading-5 text-muted-foreground">Usually finishes in a few seconds.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && job.status === 'FAILED' && (
          <div className="rounded-[1.75rem] border border-destructive/20 bg-destructive/5 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-destructive/80">Review Failed</p>
                <h3 className="text-2xl font-semibold text-foreground">The feedback run did not complete</h3>
                <p className="text-sm leading-6 text-muted-foreground">{error}</p>
              </div>
              <Button onClick={handleRegenerate} disabled={isRegenerating} size="sm">
                {isRegenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Try Again
              </Button>
            </div>
          </div>
        )}

        {error && job.status !== 'FAILED' && (
          <div className="rounded-[1.75rem] border border-border/70 bg-background/85 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Review Interrupted
                </p>
                <h3 className="text-2xl font-semibold text-foreground">The latest feedback could not be loaded</h3>
                <p className="text-sm leading-6 text-muted-foreground">{error}</p>
              </div>
              <Button onClick={handleRegenerate} disabled={isRegenerating} size="sm" variant="outline">
                {isRegenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Reload Review
              </Button>
            </div>
          </div>
        )}

        {feedback && job.status === 'DONE' && (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-[linear-gradient(135deg,hsl(var(--primary)/0.12),transparent_58%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary/75">
                    Overall Assessment
                  </p>
                  <h3 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                    Executive review of current resume positioning
                  </h3>
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
                eyebrow="What’s Working"
                title="Signals already helping your candidacy"
                description="These are the parts that read clearly, create confidence, or support your current positioning."
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
                  <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5">
                    <p className="text-sm leading-6 text-muted-foreground">
                      No specific strengths were returned for this version yet.
                    </p>
                  </div>
                )}
              </FeedbackSection>

              <FeedbackSection
                eyebrow="What’s Holding It Back"
                title="Highest-leverage improvements"
                description="Treat these as coaching priorities. They are the issues most likely to weaken fit, level, or clarity."
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
                  <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5">
                    <p className="text-sm leading-6 text-muted-foreground">
                      No improvement items were returned for this version yet.
                    </p>
                  </div>
                )}
              </FeedbackSection>
            </div>
          </div>
        )}

        {!feedback && job.status === 'DONE' && !error && (
          <div className="rounded-[1.75rem] border border-border/70 bg-background/85 p-6 shadow-sm sm:p-8">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">No Feedback</p>
              <h3 className="text-2xl font-semibold text-foreground">The review completed without displayable content</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Regenerate the analysis to request a fresh recruiter-style pass on this version.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
