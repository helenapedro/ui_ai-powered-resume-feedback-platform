import { AiFeedback } from '@/components/AiFeedback';
import { Card, CardContent } from '@/components/ui/card';

interface ResumeFeedbackSectionProps {
  resumeId: string;
  versionId: string | null;
}

export function ResumeFeedbackSection({ resumeId, versionId }: ResumeFeedbackSectionProps) {
  return (
    <section>
      {versionId ? (
        <AiFeedback resumeId={resumeId} versionId={versionId} />
      ) : (
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
            Select a version to review AI feedback.
          </CardContent>
        </Card>
      )}
    </section>
  );
}
