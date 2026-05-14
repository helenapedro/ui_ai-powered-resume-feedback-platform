import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/comments';
import { resumeService } from '@/services/resumes';
import { sharingService, type CreateShareLinkRequest } from '@/services/sharing';
import { queryKeys } from '@/features/queries/keys';

export function useResumesQuery() {
  return useQuery({
    queryKey: queryKeys.resumes.all,
    queryFn: () => resumeService.getAllResumes(),
  });
}

export function useResumeDetailsQuery(resumeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.resumes.detail(resumeId ?? ''),
    queryFn: () => resumeService.getResumeById(resumeId!),
    enabled: Boolean(resumeId),
  });
}

export function useResumeCommentsQuery(resumeId: string | undefined, versionId: string | null) {
  return useQuery({
    queryKey: queryKeys.resumes.comments(resumeId ?? '', versionId ?? ''),
    queryFn: () => commentService.getComments(resumeId!, versionId!),
    enabled: Boolean(resumeId && versionId),
  });
}

export function useShareLinksQuery(resumeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.resumes.shareLinks(resumeId ?? ''),
    queryFn: () => sharingService.getShareLinks(resumeId!),
    enabled: Boolean(resumeId),
  });
}

export function useAddCommentMutation(resumeId: string | undefined, versionId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => commentService.addComment(resumeId!, versionId!, { body }),
    onSuccess: () => {
      if (!resumeId || !versionId) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.comments(resumeId, versionId),
      });
    },
  });
}

export function useDeleteCommentMutation(resumeId: string | undefined, versionId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(resumeId!, versionId!, commentId),
    onSuccess: () => {
      if (!resumeId || !versionId) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.comments(resumeId, versionId),
      });
    },
  });
}

export function useCreateShareLinkMutation(resumeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShareLinkRequest) => sharingService.createShareLink(resumeId!, data),
    onSuccess: () => {
      if (!resumeId) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.shareLinks(resumeId),
      });
    },
  });
}

export function useRevokeShareLinkMutation(resumeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => sharingService.revokeShareLink(resumeId!, linkId),
    onSuccess: () => {
      if (!resumeId) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.shareLinks(resumeId),
      });
    },
  });
}

export function useDeleteResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) => resumeService.deleteResume(resumeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
    },
  });
}

export function useCreateResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, title }: { file: File; title?: string }) =>
      resumeService.createResume(file, title),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
    },
  });
}

export function useAddResumeVersionMutation(resumeId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => resumeService.addVersion(resumeId!, file),
    onSuccess: () => {
      if (!resumeId) {
        return;
      }

      void queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.resumes.detail(resumeId) });
    },
  });
}
