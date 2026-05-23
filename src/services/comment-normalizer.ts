import type { Comment, User } from '@/types';

type RawComment = Partial<Comment> & {
  _id?: string;
  commenterId?: Partial<User> | null;
  content?: string;
};

function getAuthorLabel(comment: RawComment): string {
  return comment.authorLabel || comment.commenterId?.username || comment.commenterId?.email || 'Guest';
}

export function normalizeComment(comment: RawComment): Comment {
  const id = comment.id || comment._id || '';
  const authorUserId = comment.authorUserId || comment.commenterId?.id || null;
  const body = comment.body || comment.content || '';

  return {
    id,
    resumeVersionId: comment.resumeVersionId || '',
    authorUserId,
    authorLabel: getAuthorLabel(comment),
    body,
    anchorRef: comment.anchorRef ?? null,
    parentCommentId: comment.parentCommentId ?? null,
    createdAt: comment.createdAt || new Date().toISOString(),
    updatedAt: comment.updatedAt ?? null,
    resumeId: comment.resumeId,
  };
}

export function normalizeComments(comments: RawComment[]): Comment[] {
  return comments.map(normalizeComment);
}
