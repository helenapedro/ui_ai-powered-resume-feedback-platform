import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, FileText, Eye, Download, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import type { ResumeVersion } from '@/types';
import { resumeService } from '@/services/resumes';

const RECENT_VERSION_LIMIT = 3;

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
  const sortedVersions = useMemo(
    () => [...versions].sort((a, b) => b.versionNumber - a.versionNumber),
    [versions],
  );
  const recentVersions = sortedVersions.slice(0, RECENT_VERSION_LIMIT);
  const olderVersions = sortedVersions.slice(RECENT_VERSION_LIMIT);
  const shouldRevealOlderVersion = olderVersions.some(
    (version) => version.id === selectedVersionId || version.id === currentVersionId,
  );
  const [isOlderOpen, setIsOlderOpen] = useState(shouldRevealOlderVersion);

  useEffect(() => {
    if (shouldRevealOlderVersion) {
      setIsOlderOpen(true);
    }
  }, [shouldRevealOlderVersion]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History ({versions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={selectedVersionId ?? ''} onValueChange={(versionId) => onPreview?.(versionId)}>
          <SelectTrigger aria-label="Jump to version">
            <SelectValue placeholder="Jump to version" />
          </SelectTrigger>
          <SelectContent>
            {sortedVersions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                Version {version.versionNumber}
                {version.id === currentVersionId ? ' - Current' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {recentVersions.map((version) => (
          <VersionRow
            key={version.id}
            resumeId={resumeId}
            version={version}
            isCurrent={version.id === currentVersionId}
            isSelected={selectedVersionId === version.id}
            onPreview={onPreview}
          />
        ))}

        {olderVersions.length > 0 && (
          <Collapsible open={isOlderOpen} onOpenChange={setIsOlderOpen} className="space-y-3">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  Older versions ({olderVersions.length})
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOlderOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-3">
                {olderVersions.map((version) => (
                  <VersionRow
                    key={version.id}
                    resumeId={resumeId}
                    version={version}
                    isCurrent={version.id === currentVersionId}
                    isSelected={selectedVersionId === version.id}
                    onPreview={onPreview}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}

interface VersionRowProps {
  resumeId: string;
  version: ResumeVersion;
  isCurrent: boolean;
  isSelected: boolean;
  onPreview?: (versionId: string) => void;
}

function VersionRow({ resumeId, version, isCurrent, isSelected, onPreview }: VersionRowProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between ${
        isCurrent ? 'border-primary bg-primary/5' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded bg-muted p-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">Version {version.versionNumber}</p>
            {isCurrent && (
              <Badge variant="secondary" className="text-xs">
                Current
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">{version.originalFilename}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(version.createdAt), 'MMM dd, yyyy HH:mm')}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Button variant={isSelected ? 'default' : 'outline'} size="sm" onClick={() => onPreview?.(version.id)}>
          <Eye className="mr-1 h-3.5 w-3.5" />
          Preview
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={resumeService.getVersionDownloadUrl(resumeId, version.id)} target="_blank" rel="noreferrer">
            <Download className="mr-1 h-3.5 w-3.5" />
            Download
          </a>
        </Button>
        <Badge variant="outline" className="text-xs">
          {version.contentType.split('/')[1]?.toUpperCase() || 'FILE'}
        </Badge>
      </div>
    </div>
  );
}
