import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { ApiError } from '@/services/api-errors';
import { MoreHorizontal, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Comment, User } from '@/types';
import { useAuth } from '@/contexts/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

export const canEditComment = (comment: Comment, currentUser: User | null | undefined) =>
  Boolean(currentUser?.id && comment.authorUserId === currentUser.id);

export const canDeleteComment = (
  comment: Comment,
  currentUser: User | null | undefined,
  resumeOwnerId?: string
) =>
  Boolean(
    currentUser?.id &&
      (comment.authorUserId === currentUser.id || resumeOwnerId === currentUser.id)
  );

function isForbiddenError(error: unknown) {
  return error instanceof ApiError && error.status === 403;
}

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  onAddComment: (content: string, guestLabel?: string) => Promise<void>;
  onEditComment?: (commentId: string, content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  resumeOwnerId?: string;
}

export function CommentList({
  comments,
  isLoading,
  onAddComment,
  onEditComment,
  onDeleteComment,
  resumeOwnerId,
}: CommentListProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [newComment, setNewComment] = useState('');
  const [guestLabel, setGuestLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deniedEditIds, setDeniedEditIds] = useState<string[]>([]);
  const [deniedDeleteIds, setDeniedDeleteIds] = useState<string[]>([]);
  const copy = language === 'pt'
    ? {
        forbidden: 'So pode editar os seus proprios comentarios.',
        updateError: 'Nao foi possivel atualizar o comentario.',
        deleteError: 'Nao foi possivel eliminar o comentario.',
        guestPlaceholder: 'O seu nome (ex.: Recruiter, Hiring Manager)',
        commentPlaceholder: 'Adicione um comentario de revisao para esta versao',
        addComment: 'Adicionar comentario',
        empty: 'Ainda nao ha comentarios de revisao para esta versao.',
        edited: 'editado',
        actions: 'Acoes do comentario',
        edit: 'Editar',
        delete: 'Eliminar',
        deleteTitle: 'Eliminar comentario?',
        deleteDescription: 'Esta acao nao pode ser desfeita.',
        cancel: 'Cancelar',
        save: 'Guardar',
      }
    : {
        forbidden: 'You can only edit your own comments.',
        updateError: 'Unable to update comment.',
        deleteError: 'Unable to delete comment.',
        guestPlaceholder: 'Your name (e.g. Recruiter, Hiring Manager)',
        commentPlaceholder: 'Add a review comment for this version',
        addComment: 'Add Comment',
        empty: 'No review comments yet for this version.',
        edited: 'edited',
        actions: 'Comment actions',
        edit: 'Edit',
        delete: 'Delete',
        deleteTitle: 'Delete comment?',
        deleteDescription: 'This action cannot be undone.',
        cancel: 'Cancel',
        save: 'Save',
      };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddComment(newComment, user ? undefined : guestLabel || undefined);
      setNewComment('');
      setGuestLabel('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editText.trim() || !onEditComment) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      await onEditComment(commentId, editText);
      setEditingId(null);
      setEditText('');
    } catch (error) {
      if (isForbiddenError(error)) {
        setDeniedEditIds((ids) => [...new Set([...ids, commentId])]);
        setEditingId(null);
        setEditText('');
        setActionError(copy.forbidden);
        return;
      }

      setActionError(error instanceof Error ? error.message : copy.updateError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!onDeleteComment) return;
    setActionError(null);
    try {
      await onDeleteComment(commentId);
    } catch (error) {
      if (isForbiddenError(error)) {
        setDeniedDeleteIds((ids) => [...new Set([...ids, commentId])]);
        setActionError(copy.forbidden);
        return;
      }

      setActionError(error instanceof Error ? error.message : copy.deleteError);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.username?.charAt(0).toUpperCase() || 'G'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          {!user && (
            <Input
              placeholder={copy.guestPlaceholder}
              value={guestLabel}
              onChange={(event) => setGuestLabel(event.target.value)}
              className="mb-2"
            />
          )}
          <Textarea
            placeholder={copy.commentPlaceholder}
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            className="min-h-[80px]"
          />
          <Button onClick={handleSubmit} disabled={!newComment.trim() || isSubmitting} size="sm">
            <Send className="h-4 w-4 mr-2" />
            {copy.addComment}
          </Button>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">{copy.empty}</p>
      ) : (
        <div className="space-y-4">
          {actionError && <p className="text-sm text-destructive">{actionError}</p>}
          {comments.map((comment) => {
            const commentId = comment.id;
            const canEdit =
              Boolean(onEditComment) &&
              canEditComment(comment, user) &&
              !deniedEditIds.includes(commentId);
            const canDelete =
              Boolean(onDeleteComment) &&
              canDeleteComment(comment, user, resumeOwnerId) &&
              !deniedDeleteIds.includes(commentId);
            const showActions = canEdit || canDelete;
            return (
              <div key={commentId} className="flex gap-3">
                <Avatar>
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {comment.authorLabel.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.authorLabel}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                      {comment.updatedAt && (
                        <span className="text-xs text-muted-foreground">
                          {copy.edited} {formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    {showActions && (
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{copy.actions}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEdit && (
                              <DropdownMenuItem
                                onSelect={() => {
                                  setActionError(null);
                                  setEditingId(commentId);
                                  setEditText(comment.body);
                                }}
                              >
                                {copy.edit}
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(event) => event.preventDefault()}
                                >
                                  {copy.delete}
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{copy.deleteTitle}</AlertDialogTitle>
                            <AlertDialogDescription>{copy.deleteDescription}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{copy.cancel}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(commentId)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {copy.delete}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  {editingId === commentId ? (
                    <div className="space-y-2 mt-2">
                      <Textarea
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        className="min-h-[60px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEdit(commentId)} disabled={isSubmitting}>
                          {copy.save}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                        >
                          {copy.cancel}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mt-1 text-muted-foreground">{comment.body}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
