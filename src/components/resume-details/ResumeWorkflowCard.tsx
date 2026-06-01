import type { ResumeVersion } from '@/types';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResumeWorkflowCardProps {
  currentVersion: ResumeVersion | undefined;
}

export function ResumeWorkflowCard({ currentVersion }: ResumeWorkflowCardProps) {
  const { language } = useLanguage();
  const copy = language === 'pt'
    ? {
        workflow: 'Fluxo',
        description: 'Feedback da IA, historico de versoes, pre-visualizacao do CV e revisoes partilhadas controladas.',
        active: 'Ativa',
      }
    : {
        workflow: 'Workflow',
        description: 'AI feedback, version history, resume preview, and controlled shared reviews.',
        active: 'Active',
      };

  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-primary/10 p-2">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.workflow}</p>
          <p className="text-sm text-muted-foreground">
            {copy.description}
          </p>
          {currentVersion && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">{copy.active} v{currentVersion.versionNumber}</Badge>
              <span className="truncate text-muted-foreground">{currentVersion.originalFilename}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
