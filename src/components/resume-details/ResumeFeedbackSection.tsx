import { AiFeedback } from '@/components/AiFeedback';
import { Card, CardContent } from '@/components/ui/card';
import type { ResumeVersion } from '@/types';

interface ResumeFeedbackSectionProps {
  resumeId: string;
  version: ResumeVersion | undefined;
  versions: ResumeVersion[];
}

export function ResumeFeedbackSection({ resumeId, version, versions }: ResumeFeedbackSectionProps) {
  return (
    <section>
      {version ? (
        <AiFeedback
          resumeId={resumeId}
          versionId={version.id}
          versionNumber={version.versionNumber}
          versions={versions}
        />
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
