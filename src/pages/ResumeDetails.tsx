import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ShareLinkModal, type ShareLinkFormData } from '@/components/ShareLinkModal';
import { ResumeDetailsHeader } from '@/components/resume-details/ResumeDetailsHeader';
import { ResumeDetailsLoading } from '@/components/resume-details/ResumeDetailsLoading';
import { ResumeFeedbackSection } from '@/components/resume-details/ResumeFeedbackSection';
import { ResumePreviewCard } from '@/components/resume-details/ResumePreviewCard';
import { ResumeSidebarTabs } from '@/components/resume-details/ResumeSidebarTabs';
import { ResumeWorkflowCard } from '@/components/resume-details/ResumeWorkflowCard';
import { useResumeDetailsPage } from '@/features/resume-details/useResumeDetailsPage';

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
    isPreviewLoading,
    setPreviewVersion,
    handleAddComment,
    handleDeleteComment,
    handleCreateShareLink,
    handleRevokeLink,
    handleDownloadVersion,
    handleDeleteResume,
  } = useResumeDetailsPage();

  const activePreviewVersion = useMemo(
    () => versions.find((version) => version.id === activePreviewId),
    [activePreviewId, versions]
  );
  const isPreviewCurrent = Boolean(activePreviewId && activePreviewId === resume?.currentVersionId);
  const activeShareLinksCount = sharedLinks.filter((link) => !link.revokedAt).length;

  if (isLoading) {
    return <ResumeDetailsLoading />;
  }

  if (!resume) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="container flex-1 px-4 py-6">
        <ResumeDetailsHeader
          activePreviewVersion={activePreviewVersion}
          currentVersion={currentVersion}
          isDeleting={isDeleting}
          onBack={() => navigate(-1)}
          onDeleteResume={handleDeleteResume}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          resume={resume}
          versionsCount={versions.length}
        />

        <div className="mx-auto max-w-[1440px] space-y-6">
          <ResumeFeedbackSection
            resumeId={resume.id}
            version={activePreviewVersion}
            versions={versions}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="min-w-0 space-y-6">
              <ResumePreviewCard
                isPreviewCurrent={isPreviewCurrent}
                isPreviewLoading={isPreviewLoading}
                onDownloadVersion={handleDownloadVersion}
                previewUrl={previewUrl}
                selectedVersionId={activePreviewId}
                version={activePreviewVersion}
              />
            </div>

            <aside className="space-y-4 xl:sticky xl:top-32 xl:self-start">
              <ResumeWorkflowCard currentVersion={currentVersion} />
              <ResumeSidebarTabs
                activeShareLinksCount={activeShareLinksCount}
                comments={comments}
                currentVersionId={resume.currentVersionId}
                isLoadingComments={isLoadingComments}
                isLoadingLinks={isLoadingLinks}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onDownloadVersion={handleDownloadVersion}
                onOpenShareModal={() => setIsShareModalOpen(true)}
                onPreviewVersion={setPreviewVersion}
                onRevokeLink={handleRevokeLink}
                resumeId={resume.id}
                selectedVersionId={activePreviewId}
                sharedLinks={sharedLinks}
                versions={versions}
              />
            </aside>
          </div>
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
