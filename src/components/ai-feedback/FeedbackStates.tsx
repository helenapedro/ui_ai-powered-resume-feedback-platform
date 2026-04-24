import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface FeedbackMessageStateProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'default' | 'outline';
  };
  tone?: 'default' | 'destructive';
}

export function FeedbackLoadingState() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-28 w-full rounded-[1.5rem]" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-40 w-full rounded-[1.5rem]" />
        <Skeleton className="h-40 w-full rounded-[1.5rem]" />
      </div>
    </div>
  );
}

export function FeedbackMessageState({
  eyebrow,
  title,
  description,
  action,
  tone = 'default',
}: FeedbackMessageStateProps) {
  const toneClasses =
    tone === 'destructive'
      ? 'border-destructive/20 bg-destructive/5'
      : 'border-border/70 bg-background/85';

  const eyebrowClasses =
    tone === 'destructive' ? 'text-destructive/80' : 'text-muted-foreground';

  return (
    <div className={`rounded-[1.75rem] border p-6 shadow-sm sm:p-8 ${toneClasses}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${eyebrowClasses}`}>{eyebrow}</p>
          <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {action && (
          <Button
            onClick={action.onClick}
            disabled={action.disabled}
            size="sm"
            variant={action.variant ?? 'default'}
          >
            {action.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

export function FeedbackProcessingState() {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-background/85 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">In Progress</p>
          <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Reviewing this resume like a recruiter would
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            The model is evaluating positioning, evidence quality, skills coverage, and whether the resume reads at
            the level it is aiming for.
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
  );
}
