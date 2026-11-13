import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CareerExperienceCard } from '@/components/career-profile/CareerExperienceCard';
import { useLanguage, type TranslationKey } from '@/contexts/LanguageContext';
import { groupCareerProfileItems } from '@/lib/career-profile';
import { CAREER_FACT_FIELDS } from '@/features/career-profile/useCareerInterview';
import type { CareerProfileResponse } from '@/types';

interface CareerProfilePanelProps {
  facts: Record<string, string>;
  profile: CareerProfileResponse | undefined;
  isLoadingProfile: boolean;
}

const FACT_LABEL_KEYS: Record<string, TranslationKey> = {
  employer: 'careerInterview.fieldEmployer',
  job_title: 'careerInterview.fieldJobTitle',
  start_date: 'careerInterview.fieldStartDate',
  end_date: 'careerInterview.fieldEndDate',
  responsibilities: 'careerInterview.fieldResponsibilities',
};

/**
 * Live right panel for the web interview shell: the facts the agent has
 * learned in this session, plus the confirmed experience on the profile.
 * Content comes from the refetched session detail and the profile query,
 * never from locally merged turn data.
 */
export function CareerProfilePanel({ facts, profile, isLoadingProfile }: CareerProfilePanelProps) {
  const { t } = useLanguage();
  const experiences = groupCareerProfileItems(profile?.items ?? []);
  const learnedFields = CAREER_FACT_FIELDS.filter((field) => facts[field]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('careerInterview.learnedTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {learnedFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('careerInterview.learnedEmpty')}</p>
          ) : (
            <dl className="space-y-2">
              {learnedFields.map((field) => (
                <div key={field} className="grid grid-cols-[110px_1fr] gap-2 text-sm">
                  <dt className="text-muted-foreground">{t(FACT_LABEL_KEYS[field])}</dt>
                  <dd className="whitespace-pre-line">{facts[field]}</dd>
                </div>
              ))}
            </dl>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('careerInterview.confirmedTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('careerInterview.confirmedEmpty')}</p>
          ) : (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <CareerExperienceCard
                  key={experience.originProposalId}
                  experience={experience}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
