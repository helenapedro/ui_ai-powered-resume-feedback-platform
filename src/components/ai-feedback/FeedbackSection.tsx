import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeedbackSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  accentClassName: string;
}

export function FeedbackSection({
  eyebrow,
  title,
  description,
  icon,
  children,
  accentClassName,
}: FeedbackSectionProps) {
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
