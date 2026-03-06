import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { resumeService } from '@/services/resumes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addComment,
  createShareLink,
  deleteComment,
  deleteResume,
  fetchComments,
  fetchResumeDetails,
  fetchSharedLinks,
  resetResumeDetailsState,
  revokeShareLink,
  setPreviewVersionId,
} from '@/store/slices/resumeDetailsSlice';
import type { ShareLinkFormData } from '@/components/ShareLinkModal';

export function useResumeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const state = useAppSelector((store) => store.resumeDetails);

  useEffect(() => {
    if (!id) {
      return;
    }

    void dispatch(fetchResumeDetails(id))
      .unwrap()
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Unable to load resume',
          description: error instanceof Error ? error.message : 'Please try again.',
        });
        navigate('/my-resumes');
      });

    void dispatch(fetchSharedLinks(id));

    return () => {
      dispatch(resetResumeDetailsState());
    };
  }, [dispatch, id, navigate, toast]);

  const activePreviewId = state.previewVersionId || state.resume?.currentVersionId || null;

  useEffect(() => {
    if (!id || !activePreviewId) {
      return;
    }

    void dispatch(fetchComments({ resumeId: id, versionId: activePreviewId }));
  }, [activePreviewId, dispatch, id]);

  const currentVersion = useMemo(
    () => state.versions.find((version) => version.id === state.resume?.currentVersionId),
    [state.resume?.currentVersionId, state.versions]
  );

  const previewUrl = activePreviewId && state.resume
    ? resumeService.getVersionPreviewUrl(state.resume.id, activePreviewId)
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

      await dispatch(addComment({ resumeId: id, versionId: activePreviewId, body: content })).unwrap();
    },
    [activePreviewId, dispatch, id]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (!id || !activePreviewId) {
        return;
      }

      await dispatch(deleteComment({ resumeId: id, versionId: activePreviewId, commentId })).unwrap();
    },
    [activePreviewId, dispatch, id]
  );

  const handleCreateShareLink = useCallback(
    async (data: ShareLinkFormData) => {
      if (!id) {
        return;
      }

      const newLink = await dispatch(
        createShareLink({
          resumeId: id,
          data: {
            permission: data.permission,
            expiresAt: data.expiresAt,
            maxUses: data.maxUses,
          },
        })
      ).unwrap();

      const url = `${window.location.origin}/share/${newLink.token}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link created and copied',
        description: 'The share link was copied to your clipboard.',
      });
    },
    [dispatch, id, toast]
  );

  const handleRevokeLink = useCallback(
    async (linkId: string) => {
      if (!id) {
        return;
      }

      await dispatch(revokeShareLink({ resumeId: id, linkId })).unwrap();
      toast({ title: 'Link revoked' });
    },
    [dispatch, id, toast]
  );

  const handleDeleteResume = useCallback(async () => {
    if (!id) {
      return;
    }

    await dispatch(deleteResume(id)).unwrap();
    toast({ title: 'Resume deleted' });
    navigate('/my-resumes');
  }, [dispatch, id, navigate, toast]);

  return {
    resume: state.resume,
    versions: state.versions,
    sharedLinks: state.sharedLinks,
    comments: state.comments,
    isLoading: state.isLoadingResume,
    isDeleting: state.isDeletingResume,
    isLoadingLinks: state.isLoadingLinks,
    isLoadingComments: state.isLoadingComments,
    isCreatingLink: state.isCreatingLink,
    currentVersion,
    activePreviewId,
    previewUrl,
    authHeaders,
    setPreviewVersion: (versionId: string | null) => dispatch(setPreviewVersionId(versionId)),
    handleAddComment,
    handleDeleteComment,
    handleCreateShareLink,
    handleRevokeLink,
    handleDeleteResume,
  };
}
