export const queryKeys = {
  resumes: {
    all: ['resumes'] as const,
    detail: (resumeId: string) => ['resumes', resumeId] as const,
    comments: (resumeId: string, versionId: string) =>
      ['resumes', resumeId, 'versions', versionId, 'comments'] as const,
    shareLinks: (resumeId: string) => ['resumes', resumeId, 'share-links'] as const,
    targetOpportunities: (resumeId: string) => ['resumes', resumeId, 'target-opportunities'] as const,
    targetedVersionLinks: (resumeId: string) => ['resumes', resumeId, 'target-opportunities', 'links'] as const,
    targetedReviewJob: (resumeId: string, opportunityId: string) =>
      ['resumes', resumeId, 'target-opportunities', opportunityId, 'targeted-review-job'] as const,
    targetedReview: (resumeId: string, opportunityId: string) =>
      ['resumes', resumeId, 'target-opportunities', opportunityId, 'targeted-review'] as const,
    aiJob: (resumeId: string, versionId: string) =>
      ['resumes', resumeId, 'versions', versionId, 'ai-job'] as const,
    aiFeedback: (resumeId: string, versionId: string) =>
      ['resumes', resumeId, 'versions', versionId, 'ai-feedback'] as const,
    aiProgress: (resumeId: string, versionId: string) =>
      ['resumes', resumeId, 'versions', versionId, 'ai-progress'] as const,
  },
  sharedResume: {
    detail: (token: string) => ['shared-resume', token] as const,
    comments: (token: string) => ['shared-resume', token, 'comments'] as const,
  },
};
