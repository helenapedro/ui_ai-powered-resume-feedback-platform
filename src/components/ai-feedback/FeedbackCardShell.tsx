import type { ReactNode } from 'react';
import { Brain, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FeedbackViewAction, StatusPresentation } from '@/components/ai-feedback/types';

interface FeedbackCardShellProps {
  children: ReactNode;
  action?: FeedbackViewAction;
  description?: string;
  status?: StatusPresentation;
}

export function FeedbackCardShell({ children, action, description, status }: FeedbackCardShellProps) {
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
              {description ??
                'A structured read on current positioning, what is already credible, and the gaps most likely to affect recruiter confidence.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {status && (
              <Badge className={cn('rounded-full border px-3 py-1 text-xs font-medium', status.color)}>
                {status.icon}
                <span className="ml-2">{status.label}</span>
              </Badge>
            )}
            {action && (
              <Button
                variant={action.variant ?? 'outline'}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {action.label}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
