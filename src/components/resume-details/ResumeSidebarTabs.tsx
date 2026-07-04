import { AiFeedback } from '@/components/AiFeedback';
import { CommentList } from '@/components/CommentList';
import { SharedLinksList } from '@/components/SharedLinksList';
import { TargetOpportunitiesPanel } from '@/components/TargetOpportunitiesPanel';
import { VersionHistory } from '@/components/VersionHistory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Comment, ResumeVersion, SharedLink } from '@/types';
import { Brain, GitCompareArrows, Link2, MessageSquare, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  reviewVersion: ResumeVersion | undefined;
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
  reviewVersion,
  selectedVersionId,
  sharedLinks,
  versions,
}: ResumeSidebarTabsProps) {
  const { language } = useLanguage();
  const copy = language === 'pt'
    ? {
        versions: 'Versoes',
        review: 'Revisao',
        progress: 'Progresso',
        comments: 'Comentarios',
        targets: 'Alvos',
        share: 'Partilhar',
        activeShareLinks: 'Links ativos de partilha',
        activeLinks: 'links ativos',
        newLink: 'Novo link',
      }
    : {
        versions: 'Versions',
        review: 'Review',
        progress: 'Progress',
        comments: 'Comments',
        targets: 'Targets',
        share: 'Share',
        activeShareLinks: 'Active share links',
        activeLinks: 'active links',
        newLink: 'New Link',
      };

  return (
    <Tabs defaultValue="review" className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-5">
        <TabsTrigger value="review" className="gap-1 px-2 text-xs sm:text-sm">
          <Brain className="h-3.5 w-3.5" />
          {copy.review}
        </TabsTrigger>
        <TabsTrigger value="progress" className="gap-1 px-2 text-xs sm:text-sm">
          <GitCompareArrows className="h-3.5 w-3.5" />
          {copy.progress}
        </TabsTrigger>
        <TabsTrigger value="comments" className="px-2 text-xs sm:text-sm">{copy.comments}</TabsTrigger>
        <TabsTrigger value="targets" className="px-2 text-xs sm:text-sm">{copy.targets}</TabsTrigger>
        <TabsTrigger value="share" className="px-2 text-xs sm:text-sm">{copy.share}</TabsTrigger>
      </TabsList>

      <TabsContent value="review" className="mt-4">
        {reviewVersion ? (
          <AiFeedback
            resumeId={resumeId}
            versionId={reviewVersion.id}
            versionNumber={reviewVersion.versionNumber}
            versions={versions}
          />
        ) : (
          <Card>
            <CardContent className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
              Select a version to review AI feedback.
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="progress" className="mt-4">
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
              {copy.comments}
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

      <TabsContent value="targets" className="mt-4">
        <TargetOpportunitiesPanel
          currentVersionId={currentVersionId}
          resumeId={resumeId}
          versions={versions}
        />
      </TabsContent>

      <TabsContent value="share" className="mt-4 space-y-4">
        <div className="rounded-lg border bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Link2 className="h-4 w-4" />
                {copy.activeShareLinks}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{activeShareLinksCount} {copy.activeLinks}</p>
            </div>
            <Button size="sm" onClick={onOpenShareModal}>
              <Share2 className="mr-2 h-4 w-4" />
              {copy.newLink}
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
