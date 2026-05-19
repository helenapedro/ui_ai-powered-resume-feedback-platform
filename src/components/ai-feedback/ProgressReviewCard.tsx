import { ArrowRight, Loader2, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import type { AiProgressDTO, AiProgressStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ProgressReviewCardProps {
  baselineVersionNumber?: number;
  currentVersionNumber: number;
  error: string | null;
  hasPreviousVersion: boolean;
  isPending: boolean;
  isUnavailable: boolean;
  progress: AiProgressDTO | null;
}

const progressStatusStyles: Record<AiProgressStatus, { label: string; badgeClassName: string; icon: typeof TrendingUp }> = {
  IMPROVED: {
    label: 'Improved',
    badgeClassName:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300',
    icon: TrendingUp,
  },
  UNCHANGED: {
    label: 'Unchanged',
    badgeClassName:
      'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300',
    icon: Minus,
  },
  DECLINED: {
    label: 'Declined',
    badgeClassName:
      'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300',
    icon: TrendingDown,
  },
};

export function ProgressReviewCard({
  baselineVersionNumber,
  currentVersionNumber,
  error,
  hasPreviousVersion,
  isPending,
  isUnavailable,
  progress,
}: ProgressReviewCardProps) {
  if (!hasPreviousVersion) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/70 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Progress Since Previous Version
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Progress comparison starts after you upload a second version.
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="rounded-[1.5rem] border border-primary/15 bg-primary/5 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/75">
              {getProgressTitle(baselineVersionNumber, currentVersionNumber)}
            </p>
            <h3 className="text-lg font-semibold text-foreground">Building version-to-version comparison</h3>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              The AI review is still processing. Progress insights will appear once this version finishes analysis.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-background/80 px-4 py-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm font-medium text-foreground">Pending</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[1.5rem] border border-border/80 bg-background/70 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {getProgressTitle(baselineVersionNumber, currentVersionNumber)}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (isUnavailable || !progress) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/70 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {getProgressTitle(baselineVersionNumber, currentVersionNumber)}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Progress comparison is not available yet for this version.
        </p>
      </div>
    );
  }

  const statusPresentation = progressStatusStyles[progress.progressStatus];
  const StatusIcon = statusPresentation.icon;

  return (
    <section className="rounded-[1.75rem] border border-primary/10 bg-[linear-gradient(145deg,hsl(var(--primary)/0.09),transparent_48%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary/75">
            {getProgressTitle(baselineVersionNumber, currentVersionNumber)}
          </p>
          <h3 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            How this version changed compared with the previous resume
          </h3>
          <p className="text-base leading-8 text-foreground/80">{progress.summary}</p>
        </div>

        <div className="grid gap-3 sm:min-w-[240px]">
          <div className="rounded-2xl border border-border/70 bg-background/85 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Status</p>
            <Badge className={`mt-3 rounded-full border px-3 py-1 text-xs font-medium ${statusPresentation.badgeClassName}`}>
              <StatusIcon className="mr-2 h-3.5 w-3.5" />
              {statusPresentation.label}
            </Badge>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/85 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Score</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{progress.progressScore}/100</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <ProgressList
          title="What improved"
          description="Signals that got stronger in this version."
          items={progress.improvedAreas}
          tone="emerald"
        />
        <ProgressList
          title="Still needs work"
          description="Issues that remain unresolved from the previous version."
          items={progress.unchangedIssues}
          tone="slate"
        />
        <ProgressList
          title="New issues"
          description="Problems introduced or made more visible in this version."
          items={progress.newIssues}
          tone="amber"
        />
      </div>
    </section>
  );
}

function ProgressList({
  description,
  items,
  title,
  tone,
}: {
  description: string;
  items: string[];
  title: string;
  tone: 'emerald' | 'slate' | 'amber';
}) {
  const toneClasses = {
    emerald: 'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20',
    slate: 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/20',
    amber: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20',
  } as const;

  const bulletClasses = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    slate: 'text-slate-500 dark:text-slate-400',
    amber: 'text-amber-600 dark:text-amber-400',
  } as const;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${toneClasses[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-foreground/86">
              <ArrowRight className={`mt-1 h-4 w-4 shrink-0 ${bulletClasses[tone]}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">No items in this category for the current comparison.</p>
      )}
    </div>
  );
}

function getProgressTitle(baselineVersionNumber: number | undefined, currentVersionNumber: number) {
  if (baselineVersionNumber) {
    return `Progress from v${baselineVersionNumber} to v${currentVersionNumber}`;
  }

  return 'Progress Since Previous Version';
}
