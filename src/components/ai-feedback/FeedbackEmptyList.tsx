interface FeedbackEmptyListProps {
  message: string;
}

export function FeedbackEmptyList({ message }: FeedbackEmptyListProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5">
      <p className="text-sm leading-6 text-muted-foreground">{message}</p>
    </div>
  );
}
