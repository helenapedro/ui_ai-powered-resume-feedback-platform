import { useState } from 'react';
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
import {
  ArrowLeft,
  Trash2,
  FileText,
  Calendar,
  Loader2,
  Upload,
  Hash,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container py-8 px-4">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-96" />
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

      <main className="flex-1 container py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsShareModalOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Partilhar
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/upload?resumeId=${resume.id}`}>
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Versao
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Deletar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deletar curriculo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acao nao pode ser desfeita. Todas as versoes serao removidas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteResume}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{resume.title || 'Curriculo sem titulo'}</CardTitle>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(resume.createdAt), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      <span>{versions.length} versoes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentVersion && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Versao Atual</h4>
                  <div className="flex items-center gap-2">
                    <Badge>v{currentVersion.versionNumber}</Badge>
                    <span className="text-sm text-muted-foreground">{currentVersion.originalFilename}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <VersionHistory
            resumeId={resume.id}
            versions={versions}
            currentVersionId={resume.currentVersionId}
            selectedVersionId={activePreviewId}
            onPreview={setPreviewVersion}
            isLoading={false}
          />
        </div>

        {previewUrl && authHeaders && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pre-visualizacao
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PdfViewer fileUrl={previewUrl} httpHeaders={authHeaders} className="min-h-[600px]" />
              </CardContent>
            </Card>
          </div>
        )}

        {activePreviewId && (
          <div className="mt-8">
            <AiFeedback resumeId={resume.id} versionId={activePreviewId} />
          </div>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comentarios
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
        </div>

        <div className="mt-8">
          <SharedLinksList
            links={sharedLinks}
            isLoading={isLoadingLinks}
            onRevoke={handleRevokeLink}
            baseUrl={window.location.origin}
          />
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
