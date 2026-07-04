import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/features/queries/keys';
import { useInvalidatingMutation } from '@/features/queries/useInvalidatingMutation';
import { ApiError } from '@/services/api';
import { targetOpportunityService } from '@/services/target-opportunities';
import type { CreateTargetOpportunityRequest, UpdateTargetOpportunityRequest } from '@/types';

const POLL_INTERVAL = 3000;

export function useTargetOpportunitiesQuery(resumeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.resumes.targetOpportunities(resumeId ?? ''),
    queryFn: () => targetOpportunityService.getTargetOpportunities(resumeId!),
    enabled: Boolean(resumeId),
  });
}

export function useCreateTargetOpportunityMutation(resumeId: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: (request: CreateTargetOpportunityRequest) =>
      targetOpportunityService.createTargetOpportunity(resumeId!, request),
    getQueryKeys: () => (resumeId ? [queryKeys.resumes.targetOpportunities(resumeId)] : []),
  });
}

export function useTargetedVersionLinksQuery(resumeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.resumes.targetedVersionLinks(resumeId ?? ''),
    queryFn: () => targetOpportunityService.getTargetedVersionLinks(resumeId!),
    enabled: Boolean(resumeId),
  });
}

export function useLinkTargetedVersionMutation(resumeId: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: ({ opportunityId, versionId }: { opportunityId: string; versionId: string }) =>
      targetOpportunityService.linkTargetedVersion(resumeId!, opportunityId, versionId),
    getQueryKeys: () =>
      resumeId
        ? [
            queryKeys.resumes.detail(resumeId),
            queryKeys.resumes.targetedVersionLinks(resumeId),
            queryKeys.resumes.targetOpportunities(resumeId),
          ]
        : [],
  });
}

export function useUpdateTargetOpportunityMutation(resumeId: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: ({ opportunityId, request }: { opportunityId: string; request: UpdateTargetOpportunityRequest }) =>
      targetOpportunityService.updateTargetOpportunity(resumeId!, opportunityId, request),
    getQueryKeys: (_data, variables) =>
      resumeId
        ? [
            queryKeys.resumes.targetOpportunities(resumeId),
            queryKeys.resumes.targetedReviewJob(resumeId, variables.opportunityId),
            queryKeys.resumes.targetedReview(resumeId, variables.opportunityId),
          ]
        : [],
  });
}

export function useDeleteTargetOpportunityMutation(resumeId: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: (opportunityId: string) => targetOpportunityService.deleteTargetOpportunity(resumeId!, opportunityId),
    getQueryKeys: (_data, opportunityId) =>
      resumeId
        ? [
            queryKeys.resumes.targetOpportunities(resumeId),
            queryKeys.resumes.targetedVersionLinks(resumeId),
            queryKeys.resumes.targetedReviewJob(resumeId, opportunityId),
            queryKeys.resumes.targetedReview(resumeId, opportunityId),
          ]
        : [],
  });
}

export function useLatestTargetedReviewJobQuery(resumeId: string | undefined, opportunityId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.resumes.targetedReviewJob(resumeId ?? '', opportunityId ?? ''),
    queryFn: () => targetOpportunityService.getLatestTargetedReviewJob(resumeId!, opportunityId!),
    enabled: Boolean(resumeId && opportunityId),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? POLL_INTERVAL : false;
    },
  });
}

export function useLatestTargetedReviewQuery(
  resumeId: string | undefined,
  opportunityId: string | undefined,
  enabled: boolean
) {
  return useQuery({
    queryKey: queryKeys.resumes.targetedReview(resumeId ?? '', opportunityId ?? ''),
    queryFn: () => targetOpportunityService.getLatestTargetedReview(resumeId!, opportunityId!),
    enabled: Boolean(resumeId && opportunityId && enabled),
  });
}

export function useCreateTargetedReviewJobMutation(resumeId: string | undefined, opportunityId: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: () => targetOpportunityService.createTargetedReviewJob(resumeId!, opportunityId!),
    getQueryKeys: () =>
      resumeId && opportunityId
        ? [
            queryKeys.resumes.targetedReviewJob(resumeId, opportunityId),
            queryKeys.resumes.targetedReview(resumeId, opportunityId),
          ]
        : [],
  });
}

export function useLatestTargetedComparisonJobQuery(
  resumeId: string | undefined,
  opportunityId: string | undefined,
  versionId: string | undefined
) {
  return useQuery({
    queryKey: queryKeys.resumes.targetedComparisonJob(resumeId ?? '', opportunityId ?? '', versionId ?? ''),
    queryFn: () => targetOpportunityService.getLatestTargetedComparisonJob(resumeId!, opportunityId!, versionId!),
    enabled: Boolean(resumeId && opportunityId && versionId),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? POLL_INTERVAL : false;
    },
  });
}

export function useLatestTargetedComparisonQuery(
  resumeId: string | undefined,
  opportunityId: string | undefined,
  versionId: string | undefined,
  enabled: boolean
) {
  return useQuery({
    queryKey: queryKeys.resumes.targetedComparison(resumeId ?? '', opportunityId ?? '', versionId ?? ''),
    queryFn: () => targetOpportunityService.getLatestTargetedComparison(resumeId!, opportunityId!, versionId!),
    enabled: Boolean(resumeId && opportunityId && versionId && enabled),
  });
}

export function useCreateTargetedComparisonJobMutation(
  resumeId: string | undefined,
  opportunityId: string | undefined,
  versionId: string | undefined
) {
  return useInvalidatingMutation({
    mutationFn: () => targetOpportunityService.createTargetedComparisonJob(resumeId!, opportunityId!, versionId!),
    getQueryKeys: () =>
      resumeId && opportunityId && versionId
        ? [
            queryKeys.resumes.targetedComparisonJob(resumeId, opportunityId, versionId),
            queryKeys.resumes.targetedComparison(resumeId, opportunityId, versionId),
          ]
        : [],
  });
}
