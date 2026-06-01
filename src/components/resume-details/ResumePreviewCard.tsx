import { format } from 'date-fns';
import type { ResumeVersion } from '@/types';
import { PdfViewer } from '@/components/PdfViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResumePreviewCardProps {
  isPreviewCurrent: boolean;
  isPreviewLoading: boolean;
  onDownloadVersion: (versionId: string, filename?: string) => Promise<void>;
  previewUrl: string | null;
  selectedVersionId: string | null;
  version: ResumeVersion | undefined;
}

export function ResumePreviewCard({
  isPreviewCurrent,
  isPreviewLoading,
  onDownloadVersion,
  previewUrl,
  selectedVersionId,
  version,
}: ResumePreviewCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 border-b bg-background sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {t('preview.title')}
          </CardTitle>
          {version && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={isPreviewCurrent ? 'default' : 'secondary'}>{t('preview.version')} {version.versionNumber}</Badge>
              {isPreviewCurrent && <Badge variant="outline">{t('preview.current')}</Badge>}
              <span>{format(new Date(version.createdAt), 'MMM dd, yyyy HH:mm')}</span>
              <span className="truncate">{version.originalFilename}</span>
            </div>
          )}
        </div>

        {selectedVersionId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadVersion(selectedVersionId, version?.originalFilename)}
          >
            {t('preview.downloadVersion')}
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {previewUrl ? (
          <PdfViewer fileUrl={previewUrl} className="min-h-[760px]" />
        ) : isPreviewLoading ? (
          <div className="flex min-h-[420px] items-center justify-center p-8 text-sm text-muted-foreground">
            {t('preview.loading')}
          </div>
        ) : selectedVersionId ? (
          <div className="flex min-h-[420px] items-center justify-center p-8 text-sm text-muted-foreground">
            {t('preview.unable')}
          </div>
        ) : (
          <div className="flex min-h-[420px] items-center justify-center p-8 text-sm text-muted-foreground">
            {t('preview.selectVersion')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
