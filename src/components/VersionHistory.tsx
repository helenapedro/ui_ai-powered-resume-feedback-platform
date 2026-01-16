import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { History, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ResumeVersion } from '@/types';

interface VersionHistoryProps {
  versions: ResumeVersion[];
  currentVersionId: string | null;
  isLoading: boolean;
}

export function VersionHistory({ versions, currentVersionId, isLoading }: VersionHistoryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Versões
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
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
            Histórico de Versões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-4">
            Nenhuma versão disponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by version number descending
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Versões ({versions.length})
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
                    <p className="font-medium text-sm">
                      Versão {version.versionNumber}
                    </p>
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        Atual
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {version.originalFilename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(version.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {version.contentType.split('/')[1]?.toUpperCase() || 'FILE'}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
