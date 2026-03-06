import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { History, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import type { ResumeVersion } from '@/types';

interface VersionHistoryProps {
  resumeId: string;
  versions: ResumeVersion[];
  currentVersionId: string | null;
  selectedVersionId?: string | null;
  onPreview?: (versionId: string) => void;
  isLoading: boolean;
}

export function VersionHistory({
  resumeId,
  versions,
  currentVersionId,
  selectedVersionId,
  onPreview,
  isLoading,
}: VersionHistoryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-4">No versions available.</p>
        </CardContent>
      </Card>
    );
  }

  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History ({versions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedVersions.map((version) => {
          const isCurrent = version.id === currentVersionId;

          return (
            <div
              key={version.id}
              className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                isCurrent ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">Version {version.versionNumber}</p>
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{version.originalFilename}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(version.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedVersionId === version.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPreview?.(version.id)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Preview
                </Button>
                <Badge variant="outline" className="text-xs">
                  {version.contentType.split('/')[1]?.toUpperCase() || 'FILE'}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
