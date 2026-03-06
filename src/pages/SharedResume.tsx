import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sharingService } from '@/services/sharing';
import { useAuth } from '@/contexts/AuthContext';
import type { SharedResumeData } from '@/types';
import { CommentList } from '@/components/CommentList';
import { PdfViewer } from '@/components/PdfViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Comment } from '@/types';
import { FileText, AlertCircle, ExternalLink, LogIn } from 'lucide-react';

export default function SharedResume() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<SharedResumeData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      void fetchSharedResume();
    }
  }, [token]);

  const fetchSharedResume = async () => {
    try {
      const response = await sharingService.getSharedResume(token!);
      setData(response);
      if (response.permission === 'COMMENT') {
        void fetchComments();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid, expired, or revoked link.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const commentsData = await sharingService.getSharedComments(token!);
      setComments(commentsData);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = useCallback(
    async (content: string) => {
      try {
        const newComment = await sharingService.postSharedComment(token!, { body: content });
        setComments((prev) => [...prev, newComment]);
        toast({ title: 'Comment added!' });
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Unable to add comment',
          description: err instanceof Error ? err.message : 'Please try again.',
        });
      }
    },
    [token, toast]
  );

  const handleDownload = () => {
    const downloadUrl = sharingService.getSharedResumeDownloadUrl(token!);
    window.open(downloadUrl, '_blank');
  };

  if (isLoading) {
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

            <div className="flex justify-center">
              <Button variant="outline" onClick={handleDownload}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>

            {data.permission === 'COMMENT' && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Comments</h3>
                {isAuthenticated ? (
                  <CommentList comments={comments} isLoading={isLoadingComments} onAddComment={handleAddComment} />
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
    </div>
  );
}
