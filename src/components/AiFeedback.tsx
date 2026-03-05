import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAiFeedback } from '@/features/ai/useAiFeedback';
import {
  Brain,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Lightbulb,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react';

interface AiFeedbackProps {
  resumeId: string;
  versionId: string;
}

export function AiFeedback({ resumeId, versionId }: AiFeedbackProps) {
  const { job, feedback, isLoading, error, isRegenerating, handleRegenerate } = useAiFeedback(
    resumeId,
    versionId
  );

  const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    PENDING: {
      icon: <Clock className="h-4 w-4" />,
      label: 'Aguardando',
      color: 'bg-muted text-muted-foreground',
    },
    PROCESSING: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      label: 'Analisando...',
      color: 'bg-primary/10 text-primary',
    },
    DONE: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Concluido',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    FAILED: {
      icon: <XCircle className="h-4 w-4" />,
      label: 'Falhou',
      color: 'bg-destructive/10 text-destructive',
    },
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Feedback IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Feedback IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Nenhuma analise disponivel para esta versao.</p>
          <Button onClick={handleRegenerate} disabled={isRegenerating} size="sm">
            {isRegenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Gerar Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }

  const status = statusConfig[job.status] || statusConfig.PENDING;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Feedback IA
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={status.color}>
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </Badge>
            {(job.status === 'DONE' || job.status === 'FAILED') && (
              <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isRegenerating}>
                {isRegenerating ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                Regenerar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {(job.status === 'PENDING' || job.status === 'PROCESSING') && (
          <div className="flex flex-col items-center py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">
              A IA esta a analisar o seu curriculo. Isto pode demorar alguns segundos...
            </p>
          </div>
        )}

        {error && job.status === 'FAILED' && (
          <div className="flex flex-col items-center py-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
            <p className="text-sm text-destructive mb-4">{error}</p>
          </div>
        )}

        {error && job.status !== 'FAILED' && (
          <div className="flex flex-col items-center py-6 text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRegenerate} disabled={isRegenerating} size="sm">
              {isRegenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Tentar Novamente
            </Button>
          </div>
        )}

        {feedback && job.status === 'DONE' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Resumo
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{feedback.summary}</p>
            </div>

            {feedback.strengths.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Pontos Fortes
                </h4>
                <ul className="space-y-2">
                  {feedback.strengths.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvements.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Melhorias Sugeridas
                </h4>
                <ul className="space-y-2">
                  {feedback.improvements.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="h-4 w-4 flex items-center justify-center text-amber-600 dark:text-amber-400 mt-0.5 shrink-0 font-bold text-xs">
                        {index + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
