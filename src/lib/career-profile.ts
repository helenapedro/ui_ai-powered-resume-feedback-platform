import type { CareerProfileItemResponse } from '@/types';

export interface CareerExperience {
  originProposalId: string;
  employer?: string;
  jobTitle?: string;
  startDate?: string;
  endDate?: string;
  responsibilities?: string;
  /** True when any field row carries an updatedAt: the experience was edited after confirmation. */
  edited: boolean;
}

const FIELD_TO_KEY: Record<string, keyof Omit<CareerExperience, 'originProposalId'>> = {
  employer: 'employer',
  job_title: 'jobTitle',
  start_date: 'startDate',
  end_date: 'endDate',
  responsibilities: 'responsibilities',
};

/**
 * Groups the flat profile items (creation order) into one experience per
 * proposal, preserving the order the experiences were confirmed in.
 * Unknown field keys are ignored so a future backend field cannot break the view.
 * An experience counts as edited when any of its field rows has an updatedAt.
 */
export function groupCareerProfileItems(items: CareerProfileItemResponse[]): CareerExperience[] {
  const groups: CareerExperience[] = [];
  const byProposal = new Map<string, CareerExperience>();

  for (const item of items) {
    let group = byProposal.get(item.originProposalId);
    if (!group) {
      group = { originProposalId: item.originProposalId, edited: false };
      byProposal.set(item.originProposalId, group);
      groups.push(group);
    }
    if (item.updatedAt != null) {
      group.edited = true;
    }
    const key = FIELD_TO_KEY[item.fieldKey];
    if (key) {
      group[key] = item.factValue;
    }
  }

  return groups;
}
