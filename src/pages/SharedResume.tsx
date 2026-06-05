import { useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sharingService } from '@/services/sharing';
import { useAuth } from '@/contexts/useAuth';
import { CommentList } from '@/components/CommentList';
import { PdfViewer } from '@/components/PdfViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  useAddSharedCommentMutation,
  useDeleteSharedCommentMutation,
  useSharedCommentsQuery,
  useSharedResumeQuery,
  useUpdateSharedCommentMutation,
} from '@/features/sharing/queries';
import { FileText, AlertCircle, ExternalLink, LogIn } from 'lucide-react';
import { LegalLinks } from '@/components/LegalLinks';

export default function SharedResume() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const sharedResumeQuery = useSharedResumeQuery(token);
  const data = sharedResumeQuery.data ?? null;
  const commentsQuery = useSharedCommentsQuery(token, data?.permission === 'COMMENT' && isAuthenticated);
  const addCommentMutation = useAddSharedCommentMutation(token);
  const updateCommentMutation = useUpdateSharedCommentMutation(token);
  const deleteCommentMutation = useDeleteSharedCommentMutation(token);
  const error = sharedResumeQuery.error
    ? sharedResumeQuery.error instanceof Error
      ? sharedResumeQuery.error.message
      : 'Invalid, expired, or revoked link.'
    : null;

  useEffect(() => {
    if (commentsQuery.error) {
      toast({
        variant: 'destructive',
        title: 'Unable to load comments',
        description: commentsQuery.error instanceof Error ? commentsQuery.error.message : 'Please try again.',
      });
    }
  }, [commentsQuery.error, toast]);

  const handleAddComment = useCallback(
    async (content: string) => {
      try {
        await addCommentMutation.mutateAsync(content);
        toast({ title: 'Comment added!' });
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Unable to add comment',
          description: err instanceof Error ? err.message : 'Please try again.',
        });
      }
    },
    [addCommentMutation, toast]
  );

  const handleEditComment = useCallback(
    async (commentId: string, content: string) => {
      await updateCommentMutation.mutateAsync({
        commentId,
        data: {
          body: content,
          anchorRef: null,
        },
      });
    },
    [updateCommentMutation]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      await deleteCommentMutation.mutateAsync(commentId);
    },
    [deleteCommentMutation]
  );

  const handleDownload = () => {
    const downloadUrl = sharingService.getSharedResumeDownloadUrl(token!);
    window.open(downloadUrl, '_blank');
  };

  if (sharedResumeQuery.isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Link unavailable</h1>
            <p className="text-muted-foreground mb-6">{error || 'This share link is not valid.'}</p>
            <Button asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Resume Feedback</span>
          </div>
          <Badge variant="secondary">
            {data.permission === 'VIEW' ? 'View only' : 'View + comments'}
          </Badge>
        </div>
      </header>

      <main className="container py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">Shared Resume</CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Badge>ID: {data.resumeId.slice(0, 8)}...</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <PdfViewer fileUrl={sharingService.getSharedResumePreviewUrl(token!)} className="min-h-[600px]" />

            {data.allowDownload && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={handleDownload}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            )}

            {data.permission === 'COMMENT' && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Comments</h3>
                {isAuthenticated ? (
                  <CommentList
                    comments={commentsQuery.data ?? []}
                    isLoading={commentsQuery.isLoading}
                    onAddComment={handleAddComment}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                  />
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign in to view and add comments.
                    </p>
                    <Button asChild size="sm">
                      <Link to={`/auth?redirect=/share/${token}`}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign in
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="border-t bg-background px-4 py-5">
        <LegalLinks />
      </footer>
    </div>
  );
}
