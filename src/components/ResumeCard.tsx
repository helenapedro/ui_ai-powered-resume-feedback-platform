import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Eye, Pin, Upload } from 'lucide-react';
import type { ResumeSummary } from '@/types';
import { format } from 'date-fns';

interface ResumeCardProps {
  resume: ResumeSummary;
  showActions?: boolean;
  isPinned?: boolean;
  onTogglePin?: (resumeId: string) => void;
}

export function ResumeCard({ resume, showActions, isPinned = false, onTogglePin }: ResumeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{resume.title || 'Untitled resume'}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(resume.createdAt), 'MMM dd, yyyy')}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {onTogglePin && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={isPinned ? 'text-amber-600 hover:text-amber-700' : 'text-muted-foreground'}
                onClick={() => onTogglePin(resume.id)}
                title={isPinned ? 'Unpin from top' : 'Pin to top'}
              >
                <Pin className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
              </Button>
            )}
            {resume.currentVersionId && (
              <Badge variant="secondary" className="text-xs shrink-0">
                Active
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/resume/${resume.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        {showActions && (
          <Button asChild variant="default" size="icon">
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
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
