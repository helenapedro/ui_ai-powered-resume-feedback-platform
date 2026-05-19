import { format } from 'date-fns';
import { resumeService } from '@/services/resumes';
import type { ResumeVersion } from '@/types';
import { PdfViewer } from '@/components/PdfViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface ResumePreviewCardProps {
  authHeaders?: Record<string, string>;
  isPreviewCurrent: boolean;
  previewUrl: string | null;
  resumeId: string;
  selectedVersionId: string | null;
  version: ResumeVersion | undefined;
}

export function ResumePreviewCard({
  authHeaders,
  isPreviewCurrent,
  previewUrl,
  resumeId,
  selectedVersionId,
  version,
}: ResumePreviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 border-b bg-background sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Resume Preview
          </CardTitle>
          {version && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={isPreviewCurrent ? 'default' : 'secondary'}>Version {version.versionNumber}</Badge>
              {isPreviewCurrent && <Badge variant="outline">Current</Badge>}
              <span>{format(new Date(version.createdAt), 'MMM dd, yyyy HH:mm')}</span>
              <span className="truncate">{version.originalFilename}</span>
            </div>
          )}
        </div>

        {selectedVersionId && (
          <Button asChild variant="outline" size="sm">
            <a href={resumeService.getVersionDownloadUrl(resumeId, selectedVersionId)} target="_blank" rel="noreferrer">
              Download Version
            </a>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {previewUrl && authHeaders ? (
          <PdfViewer fileUrl={previewUrl} httpHeaders={authHeaders} className="min-h-[760px]" />
        ) : (
          <div className="flex min-h-[420px] items-center justify-center p-8 text-sm text-muted-foreground">
            Select a version to preview its resume file.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
