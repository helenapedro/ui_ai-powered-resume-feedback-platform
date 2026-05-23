import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Edit, Trash2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  onAddComment: (content: string, guestLabel?: string) => Promise<void>;
  onEditComment?: (commentId: string, content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
}

export function CommentList({
  comments,
  isLoading,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: CommentListProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [guestLabel, setGuestLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      await onEditComment(commentId, editText);
      setEditingId(null);
      setEditText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!onDeleteComment) return;
    await onDeleteComment(commentId);
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
              placeholder="Your name (e.g. Recruiter, Hiring Manager)"
              value={guestLabel}
              onChange={(event) => setGuestLabel(event.target.value)}
              className="mb-2"
            />
          )}
          <Textarea
            placeholder="Add a review comment for this version"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            className="min-h-[80px]"
          />
          <Button onClick={handleSubmit} disabled={!newComment.trim() || isSubmitting} size="sm">
            <Send className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No review comments yet for this version.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const commentId = comment.id;
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
                    </div>
                    {user && user.id === comment.authorUserId && (onEditComment || onDeleteComment) && (
                      <div className="flex items-center gap-1">
                        {onEditComment && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingId(commentId);
                              setEditText(comment.body);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteComment && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(commentId)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
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
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                        >
                          Cancel
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
