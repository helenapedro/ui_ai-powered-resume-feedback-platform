import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { resumeService } from '@/services/resumes';
import { sessionService } from '@/services/session';
import {
  useAddCommentMutation,
  useCreateShareLinkMutation,
  useDeleteCommentMutation,
  useDeleteResumeMutation,
  useResumeCommentsQuery,
  useResumeDetailsQuery,
  useRevokeShareLinkMutation,
  useShareLinksQuery,
} from '@/features/resumes/queries';
import type { ShareLinkFormData } from '@/components/ShareLinkModal';
import type { ResumeVersion } from '@/types';

const EMPTY_VERSIONS: ResumeVersion[] = [];

export function useResumeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = sessionService.getToken();
  const [previewVersionId, setPreviewVersionId] = useState<string | null>(null);
  const resumeQuery = useResumeDetailsQuery(id);
  const shareLinksQuery = useShareLinksQuery(id);
  const resume = resumeQuery.data?.resume ?? null;
  const versions = resumeQuery.data?.versions ?? EMPTY_VERSIONS;
  const activePreviewId = previewVersionId || resume?.currentVersionId || null;
  const commentsQuery = useResumeCommentsQuery(id, activePreviewId);
  const addCommentMutation = useAddCommentMutation(id, activePreviewId);
  const deleteCommentMutation = useDeleteCommentMutation(id, activePreviewId);
  const createShareLinkMutation = useCreateShareLinkMutation(id);
  const revokeShareLinkMutation = useRevokeShareLinkMutation(id);
  const deleteResumeMutation = useDeleteResumeMutation();

  useEffect(() => {
    setPreviewVersionId(null);
  }, [id]);

  useEffect(() => {
    if (!resumeQuery.error) {
      return;
    }

    toast({
      variant: 'destructive',
      title: 'Unable to load resume',
      description: resumeQuery.error instanceof Error ? resumeQuery.error.message : 'Please try again.',
    });
    navigate('/my-resumes');
  }, [navigate, resumeQuery.error, toast]);

  const currentVersion = useMemo(
    () => versions.find((version) => version.id === resume?.currentVersionId),
    [resume?.currentVersionId, versions]
  );

  const previewUrl = activePreviewId && resume
    ? resumeService.getVersionPreviewUrl(resume.id, activePreviewId)
    : null;

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  const handleAddComment = useCallback(
    async (content: string) => {
      if (!id || !activePreviewId) {
        return;
      }

      await addCommentMutation.mutateAsync(content);
    },
    [activePreviewId, addCommentMutation, id]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (!id || !activePreviewId) {
        return;
      }

      await deleteCommentMutation.mutateAsync(commentId);
    },
    [activePreviewId, deleteCommentMutation, id]
  );

  const handleCreateShareLink = useCallback(
    async (data: ShareLinkFormData) => {
      if (!id) {
        return;
      }

      const newLink = await createShareLinkMutation.mutateAsync({
        permission: data.permission,
        expiresAt: data.expiresAt,
        maxUses: data.maxUses,
      });

      const url = `${window.location.origin}/share/${newLink.token}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link created and copied',
        description: 'The share link was copied to your clipboard.',
      });
    },
    [createShareLinkMutation, id, toast]
  );

  const handleRevokeLink = useCallback(
    async (linkId: string) => {
      if (!id) {
        return;
      }

      await revokeShareLinkMutation.mutateAsync(linkId);
      toast({ title: 'Link revoked' });
    },
    [id, revokeShareLinkMutation, toast]
  );

  const handleDeleteResume = useCallback(async () => {
    if (!id) {
      return;
    }

    await deleteResumeMutation.mutateAsync(id);
    toast({ title: 'Resume deleted' });
    navigate('/my-resumes');
  }, [deleteResumeMutation, id, navigate, toast]);

  return {
    resume,
    versions,
    sharedLinks: shareLinksQuery.data ?? [],
    comments: commentsQuery.data ?? [],
    isLoading: resumeQuery.isLoading,
    isDeleting: deleteResumeMutation.isPending,
    isLoadingLinks: shareLinksQuery.isLoading,
    isLoadingComments: commentsQuery.isLoading,
    isCreatingLink: createShareLinkMutation.isPending,
    currentVersion,
    activePreviewId,
    previewUrl,
    authHeaders,
    setPreviewVersion: setPreviewVersionId,
    handleAddComment,
    handleDeleteComment,
    handleCreateShareLink,
    handleRevokeLink,
    handleDeleteResume,
  };
}
