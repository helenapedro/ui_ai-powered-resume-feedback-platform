import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Link2, Copy, Trash2, Check, Clock, Eye, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import type { SharedLink } from '@/types';

interface SharedLinksListProps {
  links: SharedLink[];
  isLoading: boolean;
  onRevoke: (linkId: string) => Promise<void>;
  baseUrl: string;
}

export function SharedLinksList({ links, isLoading, onRevoke, baseUrl }: SharedLinksListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const copyToClipboard = async (link: SharedLink) => {
    if (!link.token) return;
    const url = `${baseUrl}/share/${link.token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = async (linkId: string) => {
    setRevokingId(linkId);
    try {
      await onRevoke(linkId);
    } finally {
      setRevokingId(null);
    }
  };

  const activeLinks = links.filter((link) => !link.revokedAt);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Link2 className="h-5 w-5" />
            Share Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="h-5 w-5" />
          Share Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeLinks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No active share links.</p>
        ) : (
          <div className="space-y-3">
            {activeLinks.map((link) => {
              const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {link.permission === 'VIEW' ? (
                          <Badge variant="secondary" className="gap-1">
                            <Eye className="h-3 w-3" />
                            View
                          </Badge>
                        ) : (
                          <Badge variant="default" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Comment
                          </Badge>
                        )}
                        {isExpired && <Badge variant="destructive">Expired</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          Created{' '}
                          {link.createdAt && !isNaN(new Date(link.createdAt).getTime())
                            ? format(new Date(link.createdAt), 'MM/dd/yyyy HH:mm')
                            : 'Unknown date'}
                        </span>
                        {link.expiresAt && !isNaN(new Date(link.expiresAt).getTime()) && (
                          <span className="text-muted-foreground">
                            | Expires {format(new Date(link.expiresAt), 'MM/dd/yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {link.token && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(link)}
                        disabled={isExpired}
                        title="Copy link"
                      >
                        {copiedId === link.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={revokingId === link.id}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke link?</AlertDialogTitle>
                          <AlertDialogDescription>
                            People with this link will no longer be able to access the resume.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRevoke(link.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Revoke
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
