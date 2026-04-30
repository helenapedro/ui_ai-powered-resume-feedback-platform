import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { PdfViewer } from '@/components/PdfViewer';
import { VersionHistory } from '@/components/VersionHistory';
import { ShareLinkModal, type ShareLinkFormData } from '@/components/ShareLinkModal';
import { SharedLinksList } from '@/components/SharedLinksList';
import { CommentList } from '@/components/CommentList';
import { AiFeedback } from '@/components/AiFeedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useResumeDetailsPage } from '@/features/resume-details/useResumeDetailsPage';
import { ArrowLeft, Trash2, FileText, Calendar, Loader2, Upload, Hash, Share2, MessageSquare, Eye, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { resumeService } from '@/services/resumes';

export default function ResumeDetails() {
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const {
    resume,
    versions,
    sharedLinks,
    comments,
    isLoading,
    isDeleting,
    isLoadingLinks,
    isLoadingComments,
    isCreatingLink,
    currentVersion,
    activePreviewId,
    previewUrl,
    authHeaders,
    setPreviewVersion,
    handleAddComment,
    handleDeleteComment,
    handleCreateShareLink,
    handleRevokeLink,
    handleDeleteResume,
  } = useResumeDetailsPage();

  const activePreviewVersion = useMemo(
    () => versions.find((version) => version.id === activePreviewId),
    [activePreviewId, versions]
  );
  const isPreviewCurrent = Boolean(activePreviewId && activePreviewId === resume?.currentVersionId);
  const activeShareLinksCount = sharedLinks.filter((link) => !link.revokedAt).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="container flex-1 px-4 py-6">
          <Skeleton className="mb-4 h-24 w-full" />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <Skeleton className="h-[760px]" />
            <Skeleton className="h-[520px]" />
          </div>
        </main>
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="container flex-1 px-4 py-6">
        <div className="sticky top-0 z-20 -mx-4 mb-6 border-b bg-muted/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-muted/75">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Back to workflows">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-semibold text-foreground">{resume.title || 'Untitled resume'}</h1>
                  {currentVersion && <Badge>v{currentVersion.versionNumber} active</Badge>}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(resume.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    {versions.length} versions
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Previewing {activePreviewVersion ? `v${activePreviewVersion.versionNumber}` : 'active version'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Button variant="outline" onClick={() => setIsShareModalOpen(true)}>
                <Share2 className="mr-2 h-4 w-4" />
                Create Share Link
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/upload?resumeId=${resume.id}`}>
                  <Upload className="mr-2 h-4 w-4" />
                  Add Version
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete resume?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All versions will be removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteResume}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-col gap-4 border-b bg-background sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Resume Preview
                  </CardTitle>
                  {activePreviewVersion && (
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant={isPreviewCurrent ? 'default' : 'secondary'}>
                        Version {activePreviewVersion.versionNumber}
                      </Badge>
                      {isPreviewCurrent && <Badge variant="outline">Current</Badge>}
                      <span>{format(new Date(activePreviewVersion.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                      <span className="truncate">{activePreviewVersion.originalFilename}</span>
                    </div>
                  )}
                </div>
                {activePreviewId && (
                  <Button asChild variant="outline" size="sm">
                    <a href={resumeService.getVersionDownloadUrl(resume.id, activePreviewId)} target="_blank" rel="noreferrer">
                      Download Version
                    </a>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {previewUrl && authHeaders ? (
                  <PdfViewer fileUrl={previewUrl} httpHeaders={authHeaders} className="min-h-[760px]" />
                ) : (
                  <div className="flex min-h-[420px] items-center justify-center p-8 text-sm text-muted-foreground">
                    Select a version to preview its resume file.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-32 xl:self-start">
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workflow</p>
                  <p className="text-sm text-muted-foreground">
                    AI feedback, version history, resume preview, and controlled shared reviews.
                  </p>
                  {currentVersion && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">Active v{currentVersion.versionNumber}</Badge>
                      <span className="truncate text-muted-foreground">{currentVersion.originalFilename}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="versions" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-4">
                <TabsTrigger value="versions">Versions</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="share">Share</TabsTrigger>
              </TabsList>

              <TabsContent value="versions" className="mt-4">
                <VersionHistory
                  resumeId={resume.id}
                  versions={versions}
                  currentVersionId={resume.currentVersionId}
                  selectedVersionId={activePreviewId}
                  onPreview={setPreviewVersion}
                  isLoading={false}
                />
              </TabsContent>

              <TabsContent value="ai" className="mt-4">
                {activePreviewId ? (
                  <AiFeedback resumeId={resume.id} versionId={activePreviewId} />
                ) : (
                  <Card>
                    <CardContent className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
                      Select a version to review AI feedback.
                    </CardContent>
                  </Card>
                )}
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
                      onAddComment={handleAddComment}
                      onDeleteComment={handleDeleteComment}
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
                    <Button size="sm" onClick={() => setIsShareModalOpen(true)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      New Link
                    </Button>
                  </div>
                </div>
                <SharedLinksList
                  links={sharedLinks}
                  isLoading={isLoadingLinks}
                  onRevoke={handleRevokeLink}
                  baseUrl={window.location.origin}
                />
              </TabsContent>
            </Tabs>
          </aside>
        </div>

        <ShareLinkModal
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          onSubmit={async (data: ShareLinkFormData) => {
            await handleCreateShareLink(data);
            setIsShareModalOpen(false);
          }}
          isLoading={isCreatingLink}
        />
      </main>
    </div>
  );
}
