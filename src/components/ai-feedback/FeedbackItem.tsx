import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeedbackItemProps {
  item: string;
  icon: ReactNode;
  containerClassName?: string;
  contentClassName?: string;
}

export function FeedbackItem({
  item,
  icon,
  containerClassName,
  contentClassName,
}: FeedbackItemProps) {
  return (
    <li
      className={cn(
        'flex gap-3 rounded-2xl border px-4 py-4 shadow-sm backdrop-blur-sm transition-colors duration-200',
        containerClassName
      )}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p
          className={cn(
            'text-sm leading-6 text-foreground/86 whitespace-normal [overflow-wrap:anywhere]',
            contentClassName
          )}
        >
          {item.trim()}
        </p>
      </div>
    </li>
  );
}
