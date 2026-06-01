import {
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';
import type { FeedbackStatusMap } from '@/components/ai-feedback/types';
import type { AppLanguage } from '@/contexts/LanguageContext';

export const getFeedbackStatusConfig = (language: AppLanguage): FeedbackStatusMap => ({
  PENDING: {
    icon: <Clock className="h-4 w-4" />,
    label: language === 'pt' ? 'Na fila' : 'Queued',
    color: 'border-border bg-background/80 text-muted-foreground',
  },
  PROCESSING: {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: language === 'pt' ? 'A analisar' : 'Analyzing',
    color: 'border-primary/15 bg-primary/10 text-primary',
  },
  DONE: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: language === 'pt' ? 'Pronto' : 'Ready',
    color:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  FAILED: {
    icon: <XCircle className="h-4 w-4" />,
    label: language === 'pt' ? 'Precisa repetir' : 'Needs retry',
    color: 'border-destructive/20 bg-destructive/10 text-destructive',
  },
});
