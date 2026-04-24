import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { parseFeedbackItem } from '@/components/ai-feedback/utils';

interface FeedbackItemProps {
  item: string;
  icon: ReactNode;
  labelClassName: string;
  containerClassName?: string;
  contentClassName?: string;
}

export function FeedbackItem({
  item,
  icon,
  labelClassName,
  containerClassName,
  contentClassName,
}: FeedbackItemProps) {
  const parsed = parseFeedbackItem(item);

  return (
    <li
      className={cn(
        'flex gap-3 rounded-2xl border px-4 py-4 shadow-sm backdrop-blur-sm transition-colors duration-200',
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
