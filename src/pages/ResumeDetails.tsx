import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { VersionHistory } from '@/components/VersionHistory';
import { ShareLinkModal } from '@/components/ShareLinkModal';
import { SharedLinksList } from '@/components/SharedLinksList';
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
import { resumeService } from '@/services/resumes';
import { sharingService } from '@/services/sharing';
import { useToast } from '@/hooks/use-toast';
import type { ResumeSummary, ResumeVersion, SharedLink } from '@/types';
import type { ShareLinkFormData } from '@/components/ShareLinkModal';
import {
  ArrowLeft,
  Trash2,
  FileText,
  Calendar,
  Loader2,
  Upload,
  Hash,
  Share2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ResumeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [resume, setResume] = useState<ResumeSummary | null>(null);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResume();
      fetchSharedLinks();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const data = await resumeService.getResumeById(id!);
      setResume(data.resume);
      setVersions(data.versions);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar currículo',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
      navigate('/my-resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSharedLinks = async () => {
    setIsLoadingLinks(true);
    try {
      const links = await sharingService.getShareLinks(id!);
      setSharedLinks(links);
    } catch (error) {
      // Silent fail - links are optional
    } finally {
      setIsLoadingLinks(false);
    }
  };

  const handleCreateShareLink = async (data: ShareLinkFormData) => {
    setIsCreatingLink(true);
    try {
      const newLink = await sharingService.createShareLink(id!, {
        permission: data.permission,
        maxUses: data.maxUses,
      });
      setSharedLinks((prev) => [...prev, newLink]);
      
      // Copy to clipboard
      const url = `${window.location.origin}/share/${newLink.token}`;
      await navigator.clipboard.writeText(url);
      
      toast({
        title: 'Link criado e copiado!',
        description: 'O link de partilha foi copiado para a área de transferência.',
      });
      setIsShareModalOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar link',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleRevokeLink = async (linkId: string) => {
    try {
      await sharingService.revokeShareLink(id!, linkId);
      setSharedLinks((prev) => prev.filter((l) => l.id !== linkId));
      toast({ title: 'Link revogado!' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao revogar link',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await resumeService.deleteResume(id!);
      toast({ title: 'Currículo removido!' });
      navigate('/my-resumes');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover currículo',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (!resume) return null;

  const currentVersion = versions.find(v => v.id === resume.currentVersionId);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        {/* Back Button & Actions */}
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
                Adicionar Versão
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
                  <AlertDialogTitle>Deletar currículo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todas as versões serão removidas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
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
          {/* Resume Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {resume.title || 'Currículo sem título'}
                  </CardTitle>
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
                      <span>{versions.length} versões</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">ID do Currículo</h4>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {resume.id}
                </code>
              </div>
              {currentVersion && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Versão Atual</h4>
                  <div className="flex items-center gap-2">
                    <Badge>v{currentVersion.versionNumber}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {currentVersion.originalFilename}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Version History */}
          <VersionHistory
            versions={versions}
            currentVersionId={resume.currentVersionId}
            isLoading={false}
          />
        </div>

        {/* Shared Links Section */}
        <div className="mt-8">
          <SharedLinksList
            links={sharedLinks}
            isLoading={isLoadingLinks}
            onRevoke={handleRevokeLink}
            baseUrl={window.location.origin}
          />
        </div>

        {/* Share Link Modal */}
        <ShareLinkModal
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          onSubmit={handleCreateShareLink}
          isLoading={isCreatingLink}
        />
      </main>
    </div>
  );
}
