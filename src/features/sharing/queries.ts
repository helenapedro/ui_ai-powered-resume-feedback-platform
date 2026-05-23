import { useQuery } from '@tanstack/react-query';
import { sharingService, type UpdateSharedCommentRequest } from '@/services/sharing';
import { queryKeys } from '@/features/queries/keys';
import { useInvalidatingMutation } from '@/features/queries/useInvalidatingMutation';

export function useSharedResumeQuery(token: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sharedResume.detail(token ?? ''),
    queryFn: () => sharingService.getSharedResume(token!),
    enabled: Boolean(token),
  });
}

export function useSharedCommentsQuery(token: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.sharedResume.comments(token ?? ''),
    queryFn: () => sharingService.getSharedComments(token!),
    enabled: Boolean(token && enabled),
  });
}

export function useAddSharedCommentMutation(token: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: (body: string) => sharingService.postSharedComment(token!, { body }),
    getQueryKeys: () => (token ? [queryKeys.sharedResume.comments(token)] : []),
  });
}

export function useUpdateSharedCommentMutation(token: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateSharedCommentRequest }) =>
      sharingService.updateSharedComment(token!, commentId, data),
    getQueryKeys: () => (token ? [queryKeys.sharedResume.comments(token)] : []),
  });
}

export function useDeleteSharedCommentMutation(token: string | undefined) {
  return useInvalidatingMutation({
    mutationFn: (commentId: string) => sharingService.deleteSharedComment(token!, commentId),
    getQueryKeys: () => (token ? [queryKeys.sharedResume.comments(token)] : []),
  });
}
