import { useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage, type TranslationKey } from '@/contexts/LanguageContext';
import {
  CAREER_FACT_FIELDS,
  type CareerConfirmationDecision,
} from '@/features/career-profile/useCareerInterview';
import type { CareerFactField, CareerProposalResponse } from '@/types';

const FIELD_LABEL_KEYS: Record<CareerFactField, TranslationKey> = {
  employer: 'careerInterview.fieldEmployer',
  job_title: 'careerInterview.fieldJobTitle',
  start_date: 'careerInterview.fieldStartDate',
  end_date: 'careerInterview.fieldEndDate',
  responsibilities: 'careerInterview.fieldResponsibilities',
};

interface CareerProposalCardProps {
  proposal: CareerProposalResponse;
  isConfirming: boolean;
  onConfirm: (
    proposalId: string,
    decision: CareerConfirmationDecision,
    editedFacts?: Record<string, string>,
  ) => void;
}

export function CareerProposalCard({ proposal, isConfirming, onConfirm }: CareerProposalCardProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedFacts, setEditedFacts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of CAREER_FACT_FIELDS) {
      initial[field] = proposal.facts[field] ?? '';
    }
    return initial;
  });

  // The backend rejects an EDIT with an incomplete set, so every field is
  // required in the form and all five are always submitted, even unchanged.
  const isEditComplete = CAREER_FACT_FIELDS.every(
    (field) => editedFacts[field]?.trim().length > 0,
  );

  const setField = (field: CareerFactField, value: string) => {
    setEditedFacts((current) => ({ ...current, [field]: value }));
  };

  return (
    <Card className="border-primary/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('careerInterview.proposalTitle')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('careerInterview.proposalDescription')}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            {CAREER_FACT_FIELDS.map((field) => (
              <div key={field} className="space-y-1">
                <Label htmlFor={`career-proposal-${field}`}>
                  {t(FIELD_LABEL_KEYS[field])}
                </Label>
                {field === 'responsibilities' ? (
                  <Textarea
                    id={`career-proposal-${field}`}
                    value={editedFacts[field] ?? ''}
                    onChange={(event) => setField(field, event.target.value)}
                    className="min-h-[80px]"
                  />
                ) : (
                  <Input
                    id={`career-proposal-${field}`}
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
                disabled={!isEditComplete || isConfirming}
                onClick={() => onConfirm(proposal.proposalId, 'EDIT', editedFacts)}
              >
                {isConfirming
                  ? t('careerInterview.confirming')
                  : t('careerInterview.saveEdited')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isConfirming}
                onClick={() => setIsEditing(false)}
              >
                {t('careerInterview.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <dl className="space-y-2">
              {CAREER_FACT_FIELDS.map((field) => (
                <div key={field} className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                  <dt className="text-muted-foreground">{t(FIELD_LABEL_KEYS[field])}</dt>
                  <dd className="whitespace-pre-line">
                    {proposal.facts[field] || t('careerInterview.factNotProvided')}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                disabled={isConfirming}
                onClick={() => onConfirm(proposal.proposalId, 'ACCEPT')}
              >
                <Check className="mr-2 h-4 w-4" />
                {isConfirming ? t('careerInterview.confirming') : t('careerInterview.accept')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isConfirming}
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {t('careerInterview.edit')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isConfirming}
                onClick={() => onConfirm(proposal.proposalId, 'REJECT')}
              >
                <X className="mr-2 h-4 w-4" />
                {t('careerInterview.reject')}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
