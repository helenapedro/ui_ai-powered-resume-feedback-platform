import { ArrowUpRight, CheckCircle2, ThumbsUp } from 'lucide-react';
import type { AiFeedbackDTO } from '@/types';
import { FeedbackEmptyList } from '@/components/ai-feedback/FeedbackEmptyList';
import { FeedbackItem } from '@/components/ai-feedback/FeedbackItem';
import { FeedbackSection } from '@/components/ai-feedback/FeedbackSection';
import { sanitizeFeedbackItems } from '@/components/ai-feedback/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeedbackCompletedViewProps {
  feedback: AiFeedbackDTO;
  versionNumber: number;
}

export function FeedbackCompletedView({ feedback, versionNumber }: FeedbackCompletedViewProps) {
  const { t } = useLanguage();
  const summary = feedback.summary?.trim() || t('feedback.summaryFallback');
  const strengths = sanitizeFeedbackItems(feedback.strengths);
  const improvements = sanitizeFeedbackItems(feedback.improvements);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-[linear-gradient(135deg,hsl(var(--primary)/0.12),transparent_58%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary/75">
              {t('feedback.forVersion', { version: versionNumber })}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {t('feedback.overallAssessment')}
            </p>
            <p className="text-base leading-8 text-foreground/80 sm:text-lg">{summary}</p>
          </div>

          <div className="grid gap-3 sm:min-w-[220px]">
            <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {t('feedback.strengthSignals')}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{strengths.length}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {t('feedback.gapsToClose')}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{improvements.length}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <FeedbackSection
          eyebrow={t('feedback.aiFeedback')}
          title={t('feedback.strengthSignals')}
          description={t('feedback.strengthDescription')}
          icon={<ThumbsUp className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />}
          accentClassName="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40"
        >
          {strengths.length > 0 ? (
            <ul className="space-y-3">
              {strengths.map((item, index) => (
                <FeedbackItem
                  key={`${item}-${index}`}
                  item={item}
                  icon={<CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                  containerClassName="border-emerald-100 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                />
              ))}
            </ul>
          ) : (
            <FeedbackEmptyList message={t('feedback.noStrengths')} />
          )}
        </FeedbackSection>

        <FeedbackSection
          eyebrow={t('feedback.aiFeedback')}
          title={t('feedback.gapsToClose')}
          description={t('feedback.gapsDescription')}
          icon={<ArrowUpRight className="h-5 w-5 text-amber-700 dark:text-amber-300" />}
          accentClassName="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40"
        >
          {improvements.length > 0 ? (
            <ul className="space-y-3">
              {improvements.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20"
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800 dark:bg-amber-950/70 dark:text-amber-200">
                      {index + 1}
                    </div>
                    <p className="min-w-0 text-sm leading-6 text-foreground/86 whitespace-normal [overflow-wrap:anywhere]">
                      {item}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <FeedbackEmptyList message={t('feedback.noGaps')} />
          )}
        </FeedbackSection>
      </div>
    </div>
  );
}
