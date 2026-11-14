import { useState } from 'react';
import { Briefcase, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage, type TranslationKey } from '@/contexts/LanguageContext';
import { CAREER_FACT_FIELDS } from '@/features/career-profile/useCareerInterview';
import { useUpdateCareerExperienceMutation } from '@/features/career-profile/queries';
import { useToast } from '@/hooks/use-toast';
import type { CareerExperience } from '@/lib/career-profile';
import type { CareerFactField } from '@/types';

const FIELD_LABEL_KEYS: Record<CareerFactField, TranslationKey> = {
  employer: 'careerInterview.fieldEmployer',
  job_title: 'careerInterview.fieldJobTitle',
  start_date: 'careerInterview.fieldStartDate',
  end_date: 'careerInterview.fieldEndDate',
  responsibilities: 'careerInterview.fieldResponsibilities',
};

const FIELD_TO_EXPERIENCE_KEY: Record<
  CareerFactField,
  'employer' | 'jobTitle' | 'startDate' | 'endDate' | 'responsibilities'
> = {
  employer: 'employer',
  job_title: 'jobTitle',
  start_date: 'startDate',
  end_date: 'endDate',
  responsibilities: 'responsibilities',
};

function factsFromExperience(experience: CareerExperience): Record<string, string> {
  const facts: Record<string, string> = {};
  for (const field of CAREER_FACT_FIELDS) {
    facts[field] = experience[FIELD_TO_EXPERIENCE_KEY[field]] ?? '';
  }
  return facts;
}

interface CareerExperienceCardProps {
  experience: CareerExperience;
}

export function CareerExperienceCard({ experience }: CareerExperienceCardProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedFacts, setEditedFacts] = useState<Record<string, string>>(() =>
    factsFromExperience(experience),
  );
  const updateMutation = useUpdateCareerExperienceMutation(experience.originProposalId);

  // The backend rejects an edit with an incomplete set, so every field is
  // required in the form and all five are always submitted, even unchanged.
  const isEditComplete = CAREER_FACT_FIELDS.every(
    (field) => editedFacts[field]?.trim().length > 0,
  );

  const startEditing = () => {
    // Reset from the current values on every open: the card stays mounted
    // across saves, so the mount-time state would go stale after an edit.
    setEditedFacts(factsFromExperience(experience));
    setIsEditing(true);
  };

  const setField = (field: CareerFactField, value: string) => {
    setEditedFacts((current) => ({ ...current, [field]: value }));
  };

  const saveEdit = () => {
    updateMutation.mutate(
      { facts: editedFacts },
      {
        onSuccess: () => setIsEditing(false),
        onError: () => {
          toast({
            variant: 'destructive',
            title: t('careerProfile.editErrorTitle'),
            description: t('careerProfile.editErrorDescription'),
          });
        },
      },
    );
  };

  const hasDates = Boolean(experience.startDate || experience.endDate);
  const dateRange = hasDates
    ? [experience.startDate, experience.endDate ?? t('careerProfile.present')].filter(Boolean).join(' - ')
    : '';

  return (
    <Card>
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-3">
            {CAREER_FACT_FIELDS.map((field) => (
              <div key={field} className="space-y-1">
                <Label htmlFor={`career-experience-${experience.originProposalId}-${field}`}>
                  {t(FIELD_LABEL_KEYS[field])}
                </Label>
                {field === 'responsibilities' ? (
                  <Textarea
                    id={`career-experience-${experience.originProposalId}-${field}`}
                    value={editedFacts[field] ?? ''}
                    onChange={(event) => setField(field, event.target.value)}
                    className="min-h-[80px]"
                  />
                ) : (
                  <Input
                    id={`career-experience-${experience.originProposalId}-${field}`}
                    value={editedFacts[field] ?? ''}
                    onChange={(event) => setField(field, event.target.value)}
                  />
                )}
              </div>
            ))}
            <p className="text-xs text-muted-foreground">{t('careerInterview.editHint')}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={!isEditComplete || updateMutation.isPending}
                onClick={saveEdit}
              >
                {updateMutation.isPending
                  ? t('careerProfile.saving')
                  : t('careerInterview.saveEdited')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() => setIsEditing(false)}
              >
                {t('details.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <Briefcase className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <h2 className="text-lg font-semibold leading-tight">
                  {experience.employer ?? t('careerProfile.untitledExperience')}
                </h2>
                {experience.jobTitle ? (
                  <p className="text-sm text-muted-foreground">{experience.jobTitle}</p>
                ) : null}
                {dateRange ? <p className="text-sm text-muted-foreground">{dateRange}</p> : null}
                {experience.edited ? (
                  <p className="text-xs text-muted-foreground">{t('careerProfile.edited')}</p>
                ) : null}
              </div>
              <Button size="sm" variant="outline" onClick={startEditing}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('careerInterview.edit')}
              </Button>
            </div>
            {experience.responsibilities ? (
              <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">
                {experience.responsibilities}
              </p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
