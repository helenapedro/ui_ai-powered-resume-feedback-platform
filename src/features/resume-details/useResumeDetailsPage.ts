import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  useUpdateCommentMutation,
} from '@/features/resumes/queries';
import type { ShareLinkFormData } from '@/components/ShareLinkModal';
import type { ResumeVersion } from '@/types';

const EMPTY_VERSIONS: ResumeVersion[] = [];

export function useResumeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = sessionService.getToken();
  const [previewVersionId, setPreviewVersionId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const requestedVersionId = searchParams.get('versionId');
  const resumeQuery = useResumeDetailsQuery(id);
  const shareLinksQuery = useShareLinksQuery(id);
  const resume = resumeQuery.data?.resume ?? null;
  const versions = resumeQuery.data?.versions ?? EMPTY_VERSIONS;
  const requestedPreviewId =
    requestedVersionId && versions.some((version) => version.id === requestedVersionId)
      ? requestedVersionId
      : null;
  const activePreviewId = previewVersionId || requestedPreviewId || resume?.currentVersionId || null;
  const commentsQuery = useResumeCommentsQuery(id, activePreviewId);
  const addCommentMutation = useAddCommentMutation(id, activePreviewId);
  const updateCommentMutation = useUpdateCommentMutation(id, activePreviewId);
  const deleteCommentMutation = useDeleteCommentMutation(id, activePreviewId);
  const createShareLinkMutation = useCreateShareLinkMutation(id);
  const revokeShareLinkMutation = useRevokeShareLinkMutation(id);
  const deleteResumeMutation = useDeleteResumeMutation();

  useEffect(() => {
    setPreviewVersionId(null);
  }, [id]);

  useEffect(() => {
    if (!versions.length || !requestedVersionId) {
      return;
    }

    const versionExists = versions.some((version) => version.id === requestedVersionId);

    if (!versionExists) {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.delete('versionId');
        return nextParams;
      }, { replace: true });
    }
  }, [requestedVersionId, setSearchParams, versions]);

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

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadPreview() {
      if (!resume || !activePreviewId || !token) {
        setPreviewUrl(null);
        setIsPreviewLoading(false);
        return;
      }

      setIsPreviewLoading(true);
      setPreviewUrl(null);

      try {
        let resolvedPreviewUrl: string;
        try {
          resolvedPreviewUrl = await resumeService.createVersionPreviewObjectUrl(resume.id, activePreviewId, token);
          objectUrl = resolvedPreviewUrl;
        } catch (blobError) {
          console.warn('Authenticated preview blob failed, falling back to preview URL:', blobError);
          resolvedPreviewUrl = await resumeService.resolveVersionPreviewUrl(resume.id, activePreviewId);
        }

        if (cancelled) {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
          return;
        }

        setPreviewUrl(resolvedPreviewUrl);
      } catch (error) {
        if (!cancelled) {
          console.error('Preview resolution error:', error);
          setPreviewUrl(null);
        }
      } finally {
        if (!cancelled) {
          setIsPreviewLoading(false);
        }
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [activePreviewId, resume, token]);

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

  const handleEditComment = useCallback(
    async (commentId: string, content: string) => {
      if (!id || !activePreviewId) {
        return;
      }

      await updateCommentMutation.mutateAsync({
        commentId,
        data: {
          body: content,
          anchorRef: null,
        },
      });
    },
    [activePreviewId, id, updateCommentMutation]
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

  const handleDownloadVersion = useCallback(
    async (versionId: string, filename?: string) => {
      if (!id || !token) {
        return;
      }

      await resumeService.downloadVersion(id, versionId, token, filename);
    },
    [id, token]
  );

  const handleSetPreviewVersion = useCallback(
    (versionId: string | null) => {
      setPreviewVersionId(versionId);
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (versionId) {
          nextParams.set('versionId', versionId);
        } else {
          nextParams.delete('versionId');
        }

        return nextParams;
      }, { replace: true });
    },
    [setSearchParams]
  );

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
    isPreviewLoading,
    setPreviewVersion: handleSetPreviewVersion,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleCreateShareLink,
    handleRevokeLink,
    handleDownloadVersion,
    handleDeleteResume,
  };
}
