import { CommentList } from '@/components/CommentList';
import { SharedLinksList } from '@/components/SharedLinksList';
import { VersionHistory } from '@/components/VersionHistory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Comment, ResumeVersion, SharedLink } from '@/types';
import { Link2, MessageSquare, Share2 } from 'lucide-react';

interface ResumeSidebarTabsProps {
  activeShareLinksCount: number;
  comments: Comment[];
  currentVersionId: string | null;
  isLoadingComments: boolean;
  isLoadingLinks: boolean;
  onAddComment: (content: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onDownloadVersion: (versionId: string, filename?: string) => Promise<void>;
  onOpenShareModal: () => void;
  onPreviewVersion: (versionId: string | null) => void;
  onRevokeLink: (linkId: string) => Promise<void>;
  resumeId: string;
  resumeOwnerId?: string;
  selectedVersionId: string | null;
  sharedLinks: SharedLink[];
  versions: ResumeVersion[];
}

export function ResumeSidebarTabs({
  activeShareLinksCount,
  comments,
  currentVersionId,
  isLoadingComments,
  isLoadingLinks,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onDownloadVersion,
  onOpenShareModal,
  onPreviewVersion,
  onRevokeLink,
  resumeId,
  resumeOwnerId,
  selectedVersionId,
  sharedLinks,
  versions,
}: ResumeSidebarTabsProps) {
  return (
    <Tabs defaultValue="versions" className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-3">
        <TabsTrigger value="versions">Versions</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="share">Share</TabsTrigger>
      </TabsList>

      <TabsContent value="versions" className="mt-4">
        <VersionHistory
          versions={versions}
          currentVersionId={currentVersionId}
          selectedVersionId={selectedVersionId}
          onDownloadVersion={onDownloadVersion}
          onPreview={onPreviewVersion}
          isLoading={false}
        />
      </TabsContent>

      <TabsContent value="comments" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommentList
              comments={comments}
              isLoading={isLoadingComments}
              onAddComment={onAddComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              resumeOwnerId={resumeOwnerId}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="share" className="mt-4 space-y-4">
        <div className="rounded-lg border bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Link2 className="h-4 w-4" />
                Active share links
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{activeShareLinksCount} active links</p>
            </div>
            <Button size="sm" onClick={onOpenShareModal}>
              <Share2 className="mr-2 h-4 w-4" />
              New Link
            </Button>
          </div>
        </div>
        <SharedLinksList
          links={sharedLinks}
          isLoading={isLoadingLinks}
          onRevoke={onRevokeLink}
          baseUrl={window.location.origin}
        />
      </TabsContent>
    </Tabs>
  );
}
