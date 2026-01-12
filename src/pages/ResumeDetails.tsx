import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CommentList } from '@/components/CommentList';
import { VersionHistory } from '@/components/VersionHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { commentService } from '@/services/comments';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Resume, ResumeVersion, Comment } from '@/types';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Sparkles,
  MessageSquare,
  User,
  Calendar,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ResumeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [resume, setResume] = useState<Resume | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLoadingVersions, setIsLoadingVersions] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  const isOwner = user?._id === resume?.posterId?._id;

  useEffect(() => {
    if (id) {
      fetchResume();
      fetchComments();
    }
  }, [id]);

  useEffect(() => {
    // Only fetch versions after resume loads AND user is the owner
    if (resume && user && user._id === resume.posterId?._id) {
      fetchVersions();
    } else {
      setIsLoadingVersions(false);
    }
  }, [resume, user]);

  const fetchResume = async () => {
    try {
      const data = await resumeService.getResumeById(id!);
      setResume(data);
      setEditDescription(data.description || '');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar currículo',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await commentService.getComments(id!);
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray((data as unknown as { comments?: unknown }).comments)
          ? ((data as unknown as { comments: Comment[] }).comments)
          : [];
      setComments(normalized);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const fetchVersions = async () => {
    try {
      // Uses authenticated user's resume - no resumeId needed
      const data = await resumeService.getVersions();
      setVersions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleAddComment = async (content: string) => {
    const result = await commentService.addComment(id!, content);
    setComments([result.comment, ...comments]);
    toast({ title: 'Comentário adicionado!' });
  };

  const handleEditComment = async (commentId: string, content: string) => {
    const result = await commentService.updateComment(commentId, content);
    setComments(comments.map((c) => (c._id === commentId ? result.comment : c)));
    toast({ title: 'Comentário atualizado!' });
  };

  const handleDeleteComment = async (commentId: string) => {
    await commentService.deleteComment(commentId);
    setComments(comments.filter((c) => c._id !== commentId));
    toast({ title: 'Comentário removido!' });
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      // Uses authenticated user's resume - no resumeId needed
      const result = await resumeService.restoreVersion(versionId);
      setResume(result.resume);
      fetchVersions();
      toast({ title: 'Versão restaurada com sucesso!' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao restaurar versão',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
    }
  };

  const handleUpdateDescription = async () => {
    setIsSavingDescription(true);
    try {
      // Uses authenticated user's resume - no resumeId needed
      const result = await resumeService.updateDescription(editDescription);
      setResume(result.resume);
      setEditDialogOpen(false);
      toast({ title: 'Descrição atualizada!' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar descrição',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
    } finally {
      setIsSavingDescription(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Uses authenticated user's resume - no resumeId needed
      await resumeService.deleteResume();
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
            <Skeleton className="aspect-[3/4]" />
            <div className="space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!resume) return null;

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
          
          {isOwner && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
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
                      Esta ação não pode ser desfeita. Todas as versões e comentários serão removidos.
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
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* PDF Viewer */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-muted relative overflow-hidden rounded-lg">
                  {resume.format === 'pdf' ? (
                    <iframe
                      src={resume.url}
                      className="w-full h-full"
                      title="Currículo"
                    />
                  ) : (
                    <img
                      src={resume.url}
                      alt="Currículo"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            <Button variant="outline" className="w-full" asChild>
              <a href={resume.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir em Nova Aba
              </a>
            </Button>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Resume Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{resume.posterId?.username || 'Usuário'}</span>
                      {isOwner && (
                        <Badge variant="secondary">Seu currículo</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(resume.createdAt), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge variant={resume.aiFeedback && resume.aiFeedback.length > 0 ? 'default' : 'secondary'}>
                    {resume.aiFeedback && resume.aiFeedback.length > 0 ? 'Feedback Pronto' : 'Pendente'}
                  </Badge>
                </div>
              </CardHeader>
              {resume.description && (
                <CardContent>
                  <p className="text-muted-foreground">{resume.description}</p>
                </CardContent>
              )}
            </Card>

            {/* AI Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Feedback de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resume.aiFeedback && resume.aiFeedback.length > 0 ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{resume.aiFeedback}</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      O feedback de IA está sendo processado...
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Isso pode levar alguns minutos.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Version History (only for owner) */}
            {isOwner && (
              <VersionHistory
                versions={versions}
                isLoading={isLoadingVersions}
                onRestore={handleRestoreVersion}
              />
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comentários ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CommentList
                  comments={comments}
                  isLoading={isLoadingComments}
                  onAddComment={handleAddComment}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Description Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Descrição</DialogTitle>
              <DialogDescription>
                Atualize a descrição do seu currículo.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Adicione uma descrição..."
              maxLength={500}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground text-right">
              {editDescription.length}/500 caracteres
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateDescription} disabled={isSavingDescription}>
                {isSavingDescription && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
