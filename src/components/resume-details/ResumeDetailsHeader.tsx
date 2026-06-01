import { Link } from 'react-router-dom';
import { format } from 'date-fns';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Resume, ResumeVersion } from '@/types';
import { ArrowLeft, Calendar, Eye, Hash, Loader2, Share2, Trash2, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResumeDetailsHeaderProps {
  activePreviewVersion: ResumeVersion | undefined;
  currentVersion: ResumeVersion | undefined;
  isDeleting: boolean;
  onBack: () => void;
  onDeleteResume: () => Promise<void>;
  onOpenShareModal: () => void;
  resume: Resume;
  versionsCount: number;
}

export function ResumeDetailsHeader({
  activePreviewVersion,
  currentVersion,
  isDeleting,
  onBack,
  onDeleteResume,
  onOpenShareModal,
  resume,
  versionsCount,
}: ResumeDetailsHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 border-b bg-muted/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-muted/75">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label={t('details.back')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-semibold text-foreground">{resume.title || t('details.untitled')}</h1>
              {currentVersion && <Badge>v{currentVersion.versionNumber} {t('details.active')}</Badge>}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(resume.createdAt), 'MMM dd, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                {versionsCount} {t('details.versions')}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {t('details.previewing')} {activePreviewVersion ? `v${activePreviewVersion.versionNumber}` : t('details.activeVersion')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Button variant="outline" onClick={onOpenShareModal}>
            <Share2 className="mr-2 h-4 w-4" />
            {t('details.createShareLink')}
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/upload?resumeId=${resume.id}`}>
              <Upload className="mr-2 h-4 w-4" />
              {t('details.addVersion')}
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
                {t('details.delete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('details.deleteResumeTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('details.deleteResumeDescription')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('details.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteResume}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t('details.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
