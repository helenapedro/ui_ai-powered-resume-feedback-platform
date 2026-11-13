import { Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CareerExperience } from '@/lib/career-profile';

interface CareerExperienceCardProps {
  experience: CareerExperience;
}

export function CareerExperienceCard({ experience }: CareerExperienceCardProps) {
  const { t } = useLanguage();

  const hasDates = Boolean(experience.startDate || experience.endDate);
  const dateRange = hasDates
    ? [experience.startDate, experience.endDate ?? t('careerProfile.present')].filter(Boolean).join(' - ')
    : '';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Briefcase className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold leading-tight">
              {experience.employer ?? t('careerProfile.untitledExperience')}
            </h2>
            {experience.jobTitle ? (
              <p className="text-sm text-muted-foreground">{experience.jobTitle}</p>
            ) : null}
            {dateRange ? <p className="text-sm text-muted-foreground">{dateRange}</p> : null}
          </div>
        </div>
        {experience.responsibilities ? (
          <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">
            {experience.responsibilities}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
