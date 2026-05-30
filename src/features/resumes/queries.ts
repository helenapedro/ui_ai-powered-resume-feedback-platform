import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentService, type UpdateCommentRequest } from '@/services/comments';
import { resumeService } from '@/services/resumes';
import { sharingService, type CreateShareLinkRequest } from '@/services/sharing';
import { queryKeys } from '@/features/queries/keys';
import { useInvalidatingMutation } from '@/features/queries/useInvalidatingMutation';
import type { Comment } from '@/types';

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
  return useInvalidatingMutation({
    mutationFn: (body: string) => commentService.addComment(resumeId!, versionId!, { body }),
    getQueryKeys: () => (resumeId && versionId ? [queryKeys.resumes.comments(resumeId, versionId)] : []),
  });
}

export function useUpdateCommentMutation(resumeId: string | undefined, versionId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentRequest }) =>
      commentService.updateComment(resumeId!, versionId!, commentId, data),
    onSuccess: (updatedComment) => {
      if (!resumeId || !versionId) {
        return;
      }

      queryClient.setQueryData<Comment[]>(
        queryKeys.resumes.comments(resumeId, versionId),
        (comments = []) =>
          comments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
      );
    },
  });
}

export function useDeleteCommentMutation(resumeId: string | undefined, versionId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(resumeId!, versionId!, commentId),
    onSuccess: (_data, commentId) => {
      if (!resumeId || !versionId) {
        return;
      }

      queryClient.setQueryData<Comment[]>(
        queryKeys.resumes.comments(resumeId, versionId),
        (comments = []) => comments.filter((comment) => comment.id !== commentId)
      );
    },
  });
}

export function useCreateShareLinkMutation(resumeId: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: (data: CreateShareLinkRequest) => sharingService.createShareLink(resumeId!, data),
    getQueryKeys: () => (resumeId ? [queryKeys.resumes.shareLinks(resumeId)] : []),
  });
}

export function useRevokeShareLinkMutation(resumeId: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: (linkId: string) => sharingService.revokeShareLink(resumeId!, linkId),
    getQueryKeys: () => (resumeId ? [queryKeys.resumes.shareLinks(resumeId)] : []),
  });
}

export function useDeleteResumeMutation() {
  return useInvalidatingMutation({
    mutationFn: (resumeId: string) => resumeService.deleteResume(resumeId),
    getQueryKeys: () => [queryKeys.resumes.all],
  });
}

export function useCreateResumeMutation() {
  return useInvalidatingMutation({
    mutationFn: ({ file, title }: { file: File; title?: string }) =>
      resumeService.createResume(file, title),
    getQueryKeys: () => [queryKeys.resumes.all],
  });
}

export function useAddResumeVersionMutation(resumeId: string | null) {
  return useInvalidatingMutation({
    mutationFn: (file: File) => resumeService.addVersion(resumeId!, file),
    getQueryKeys: () => (resumeId ? [queryKeys.resumes.all, queryKeys.resumes.detail(resumeId)] : []),
  });
}
