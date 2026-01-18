import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sharingService, SharedResumeResponse } from '@/services/sharing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, AlertCircle, ExternalLink } from 'lucide-react';

export default function SharedResume() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<SharedResumeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchSharedResume();
    }
  }, [token]);

  const fetchSharedResume = async () => {
    try {
      const response = await sharingService.getSharedResume(token!);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Link inválido, expirado ou revogado.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Link Indisponível</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'Este link de partilha não é válido.'}
            </p>
            <Button asChild>
              <Link to="/auth">Fazer Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Resume Feedback</span>
          </div>
          <Badge variant="secondary">
            {data.permission === 'VIEW' ? 'Apenas Visualização' : 'Visualização + Comentários'}
          </Badge>
        </div>
      </header>

      <main className="container py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {data.resume.title || 'Currículo'}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Badge>v{data.version.versionNumber}</Badge>
                  <span>{data.version.originalFilename}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Pré-visualização do currículo
              </p>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Ficheiro
              </Button>
            </div>

            {data.permission === 'COMMENT' && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Comentários</h3>
                <p className="text-sm text-muted-foreground">
                  Funcionalidade de comentários disponível em breve.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
