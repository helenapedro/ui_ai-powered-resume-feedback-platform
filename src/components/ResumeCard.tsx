import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Calendar, MessageSquare } from 'lucide-react';
import type { Resume } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ResumeCardProps {
  resume: Resume;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const feedbackStatus = resume?.aiFeedback && resume.aiFeedback.length > 0
    ? 'ready'
    : 'pending';

  return (
    <Link to={`/resume/${resume._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-[3/4] bg-muted relative overflow-hidden">
          {resume.format === 'pdf' ? (
            <iframe
              src={`${resume.url}#page=1&view=FitH`}
              className="w-full h-full pointer-events-none"
              title={`Preview de ${resume.posterId?.username || 'Usuário'}`}
            />
          ) : (
            <img
              src={resume.url}
              alt={`Currículo de ${resume.posterId?.username || 'Usuário'}`}
              className="w-full h-full object-cover object-top"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge
            variant={feedbackStatus === 'ready' ? 'default' : 'secondary'}
            className="absolute top-2 right-2"
          >
            {feedbackStatus === 'ready' ? 'Feedback Pronto' : 'Pendente'}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{resume.posterId?.username || 'Usuário'}</span>
          </div>
          {resume.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {resume.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(resume.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>Comentários</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function ResumeCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[3/4]" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Skeleton className="h-3 w-20" />
      </CardFooter>
    </Card>
  );
}
