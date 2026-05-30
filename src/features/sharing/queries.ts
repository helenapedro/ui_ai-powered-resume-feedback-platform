import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sharingService, type UpdateSharedCommentRequest } from '@/services/sharing';
import { queryKeys } from '@/features/queries/keys';
import { useInvalidatingMutation } from '@/features/queries/useInvalidatingMutation';
import type { Comment } from '@/types';

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateSharedCommentRequest }) =>
      sharingService.updateSharedComment(token!, commentId, data),
    onSuccess: (updatedComment) => {
      if (!token) {
        return;
      }

      queryClient.setQueryData<Comment[]>(
        queryKeys.sharedResume.comments(token),
        (comments = []) =>
          comments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
      );
    },
  });
}

export function useDeleteSharedCommentMutation(token: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => sharingService.deleteSharedComment(token!, commentId),
    onSuccess: (_data, commentId) => {
      if (!token) {
        return;
      }

      queryClient.setQueryData<Comment[]>(
        queryKeys.sharedResume.comments(token),
        (comments = []) => comments.filter((comment) => comment.id !== commentId)
      );
    },
  });
}
