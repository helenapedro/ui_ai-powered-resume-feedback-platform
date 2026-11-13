import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, PanelBottom } from 'lucide-react';
import { Header } from '@/components/Header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CareerInterviewComposer } from '@/components/career-profile/CareerInterviewComposer';
import { CareerInterviewProgress } from '@/components/career-profile/CareerInterviewProgress';
import { CareerInterviewThread } from '@/components/career-profile/CareerInterviewThread';
import { CareerProfilePanel } from '@/components/career-profile/CareerProfilePanel';
import { useCareerInterview } from '@/features/career-profile/useCareerInterview';
import { useLanguage } from '@/contexts/LanguageContext';
import { groupCareerProfileItems } from '@/lib/career-profile';

export default function CareerInterview() {
  const { t } = useLanguage();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const interview = useCareerInterview();

  const confirmedCount = groupCareerProfileItems(interview.profile?.items ?? []).length;

  const actionErrorTitle =
    interview.actionError?.kind === 'conflict'
      ? t('careerInterview.versionConflictTitle')
      : interview.actionError?.kind === 'agent'
        ? t('careerInterview.agentUnavailableTitle')
        : interview.actionError?.kind === 'auth'
          ? t('careerInterview.sessionExpiredTitle')
          : t('careerInterview.sessionErrorTitle');
  const actionErrorDescription =
    interview.actionError?.kind === 'conflict'
      ? t('careerInterview.versionConflictDescription')
      : interview.actionError?.kind === 'agent'
        ? t('careerInterview.agentUnavailableDescription')
        : interview.actionError?.kind === 'auth'
          ? t('careerInterview.sessionExpiredDescription')
          : interview.actionError?.message || t('careerInterview.sessionErrorDescription');

  return (
    <div className="min-h-dvh bg-muted/40">
      <Header />
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:py-10">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{t('careerInterview.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('careerInterview.description')}</p>
            {interview.detail ? (
              <CareerInterviewProgress confirmedCount={confirmedCount} status={interview.status} />
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {interview.detail ? (
              <Button
                variant="outline"
                className="xl:hidden"
                onClick={() => setIsProfileSheetOpen(true)}
              >
                <PanelBottom className="mr-2 h-4 w-4" />
                {t('careerInterview.viewProfilePanel')}
              </Button>
            ) : null}
            {interview.sessionId && !interview.isTerminal ? (
              <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={interview.isCancelling}>
                    {t('careerInterview.cancel')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('careerInterview.cancelTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('careerInterview.cancelDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('careerInterview.keepGoing')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        interview.cancelSession();
                        setIsCancelDialogOpen(false);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('careerInterview.cancelConfirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>
        </div>

        {interview.actionError ? (
          <Alert
            variant={interview.actionError.kind === 'conflict' ? 'default' : 'destructive'}
            className="mb-6"
          >
            <AlertTitle>{actionErrorTitle}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{actionErrorDescription}</p>
              {interview.actionError.kind === 'agent' ? (
                <Button size="sm" variant="outline" onClick={() => interview.retrySend()}>
                  {t('careerInterview.retry')}
                </Button>
              ) : null}
            </AlertDescription>
          </Alert>
        ) : null}

        {interview.isStarting ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : interview.startError ? (
          <Card>
            <CardContent className="space-y-4 p-6 text-center">
              <p className="font-medium">{t('careerInterview.startErrorTitle')}</p>
              <p className="text-sm text-muted-foreground">
                {t('careerInterview.startErrorDescription')}
              </p>
              <Button onClick={() => interview.retryStart()}>{t('careerInterview.retry')}</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
            <div className="min-w-0">
              <Card>
                <CardContent className="space-y-6 p-4 sm:p-6">
                  {interview.isTerminal ? (
                    <Alert>
                      <AlertTitle>
                        {interview.status === 'COMPLETED'
                          ? t('careerInterview.completedNotice')
                          : t('careerInterview.cancelledNotice')}
                      </AlertTitle>
                      <AlertDescription>
                        <Link
                          to="/career-profile"
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          {t('careerInterview.viewProfile')}
                        </Link>
                      </AlertDescription>
                    </Alert>
                  ) : null}
                  {interview.isSessionLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <CareerInterviewThread
                      messages={interview.detail?.messages ?? []}
                      pendingProposal={interview.pendingProposal}
                      isConfirming={interview.isConfirming}
                      onConfirm={interview.confirmProposal}
                    />
                  )}
                  <CareerInterviewComposer
                    value={interview.draft}
                    onChange={interview.setDraft}
                    onSend={interview.send}
                    disabled={!interview.sessionId || interview.isTerminal}
                    isSending={interview.isSending || interview.isRetrying}
                  />
                </CardContent>
              </Card>
            </div>

            <aside className="hidden space-y-4 xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:block xl:self-start xl:overflow-y-auto xl:pr-1">
              <CareerProfilePanel
                facts={interview.detail?.facts ?? {}}
                profile={interview.profile}
                isLoadingProfile={interview.isProfileLoading}
              />
            </aside>
          </div>
        )}

        {/*
          Mobile layout (below xl): the side panel is hidden and the same
          profile facts live in a bottom sheet instead, so the conversation
          stays full width. The web split screen above xl is unchanged.
        */}
        <Drawer open={isProfileSheetOpen} onOpenChange={setIsProfileSheetOpen}>
          <DrawerContent className="max-h-[85dvh]">
            <DrawerHeader>
              <DrawerTitle>{t('careerInterview.profilePanelTitle')}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-6">
              <CareerProfilePanel
                facts={interview.detail?.facts ?? {}}
                profile={interview.profile}
                isLoadingProfile={interview.isProfileLoading}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </main>
    </div>
  );
}
