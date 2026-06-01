import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Eye, Pin, Upload, ArrowRight } from 'lucide-react';
import type { ResumeSummary } from '@/types';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResumeCardProps {
  resume: ResumeSummary;
  showActions?: boolean;
  isPinned?: boolean;
  onTogglePin?: (resumeId: string) => void;
}

export function ResumeCard({ resume, showActions, isPinned = false, onTogglePin }: ResumeCardProps) {
  const { language } = useLanguage();
  const copy = language === 'pt'
    ? {
        untitled: 'CV sem titulo',
        pinned: 'Fixado',
        activeWorkflow: 'Fluxo ativo',
        noActiveVersion: 'Sem versao ativa',
        unpin: 'Desafixar do topo',
        pin: 'Fixar no topo',
        open: 'Abrir',
        addVersion: 'Adicionar versao',
      }
    : {
        untitled: 'Untitled resume',
        pinned: 'Pinned',
        activeWorkflow: 'Active workflow',
        noActiveVersion: 'No active version',
        unpin: 'Unpin from top',
        pin: 'Pin to top',
        open: 'Open',
        addVersion: 'Add version',
      };

  return (
    <Card className="group h-full overflow-hidden border-border/80 bg-background shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-semibold">{resume.title || copy.untitled}</h3>
              {isPinned && (
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                  {copy.pinned}
                </Badge>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(resume.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant={resume.currentVersionId ? 'secondary' : 'outline'} className="text-xs">
                {resume.currentVersionId ? copy.activeWorkflow : copy.noActiveVersion}
              </Badge>
            </div>
          </div>
          {onTogglePin && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={isPinned ? 'shrink-0 text-amber-600 hover:text-amber-700' : 'shrink-0 text-muted-foreground'}
              onClick={() => onTogglePin(resume.id)}
              title={isPinned ? copy.unpin : copy.pin}
            >
              <Pin className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t bg-muted/20 px-5 py-4">
        <Button asChild variant="outline" className="flex-1 justify-between">
          <Link to={`/resume/${resume.id}`}>
            <span className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              {copy.open}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
        {showActions && (
          <Button asChild variant="default" size="icon" title={copy.addVersion}>
            <Link to={`/upload?resumeId=${resume.id}`}>
              <Upload className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function ResumeCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 px-5 py-4">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
