import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Mail, ArrowLeft, Settings, BrainCircuit, Eye, History, Share2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/useAuth';
import { AuthFormTabs } from '@/pages/auth/AuthFormTabs';
import { DEFAULT_REDIRECT } from '@/pages/auth/constants';
import { useAuthPageActions } from '@/pages/auth/useAuthPageActions';
import { useGoogleGsiButton } from '@/pages/auth/useGoogleGsiButton';
import { userService, type UserProfile } from '@/services/users';
import { useLanguage } from '@/contexts/LanguageContext';
import handshakeFeaturedImage from '../../docs/project-images/handshake_featured.png';

export default function Auth() {
  const { language, setLanguage } = useLanguage();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || DEFAULT_REDIRECT;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const { user, isAuthenticated, logout } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const {
    isLoading,
    isGoogleLoading,
    handleLogin,
    handleRegister,
    handleReactivate,
    handleGoogleCredential,
    showMissingGoogleCredentialError,
  } = useAuthPageActions({ redirectTo });

  const googleAuth = useGoogleGsiButton({
    clientId: googleClientId,
    onCredential: handleGoogleCredential,
    onMissingCredential: showMissingGoogleCredentialError,
    renderButton: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!isAuthenticated) {
        setProfile(null);
        return;
      }

      try {
        const data = await userService.getMe();
        if (!cancelled) {
          setProfile(data);
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const profileLabel = profile?.fullName || user?.email?.split('@')[0] || 'Resume Feedback';
  const profileInitials = useMemo(
    () =>
      profile?.fullName
        ? profile.fullName
            .split(' ')
            .map((name) => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : (user?.email?.[0] || 'R').toUpperCase(),
    [profile?.fullName, user?.email]
  );

  const handleRemoveSavedProfile = () => {
    logout();
    setProfile(null);
    setShowEmailForm(false);
  };

  const copy = language === 'pt'
    ? {
        badge: 'Revisao de CV com IA e historico de versoes',
        intro: 'Carregue drafts, acompanhe feedback, recolha comentarios e partilhe a versao exata em revisao.',
        featured: 'Destacado no Handshake AI Showcase',
        featuredDescription: 'Projeto destacado no showcase de IA da Handshake pela abordagem de revisao de CV com versoes.',
        removeProfilesTitle: 'Remover perfis deste browser',
        removeProfilesDescription: 'Remova o acesso guardado neste dispositivo. Pode entrar novamente a qualquer momento.',
        remove: 'Remover',
        noSavedProfile: 'Nenhum perfil guardado foi encontrado neste browser.',
        workspaceTitle: 'Entrar no workspace',
        workspaceDescription: 'Entre para gerir CVs, versoes, feedback e revisoes partilhadas.',
        google: 'Continuar com Google',
        email: 'Continuar com email',
        back: 'Voltar',
        language: 'EN',
        feedbackTitle: 'Feedback ligado a versao',
        feedbackDescription: 'Cada revisao fica presa a uma versao especifica do CV.',
        progressTitle: 'Progresso entre drafts',
        progressDescription: 'Compare o que melhorou, o que continua fraco e o que apareceu de novo.',
        previewTitle: 'Contexto num so lugar',
        previewDescription: 'Preview, download, comentarios e historico ficam juntos.',
        shareTitle: 'Partilha controlada',
        shareDescription: 'Crie links de revisao, controle acesso e revogue quando necessario.',
      }
    : {
        badge: 'AI Resume Review with Version Tracking',
        intro: 'Upload drafts, track feedback, collect comments, and share the exact version under review.',
        featured: 'Featured in the Handshake AI Showcase',
        featuredDescription: 'Featured project in Handshake AI Showcase for version-aware AI resume review.',
        removeProfilesTitle: 'Remove profiles from this browser',
        removeProfilesDescription: 'Remove saved access on this device. You can sign in again at any time.',
        remove: 'Remove',
        noSavedProfile: 'No saved profile was found in this browser.',
        workspaceTitle: 'Enter your workspace',
        workspaceDescription: 'Sign in to manage resumes, versions, feedback, and shared reviews.',
        google: 'Continue with Google',
        email: 'Continue with Email',
        back: 'Back',
        language: 'PT',
        feedbackTitle: 'Feedback tied to the version',
        feedbackDescription: 'Each review stays connected to the exact resume draft it was generated for.',
        progressTitle: 'Progress across drafts',
        progressDescription: 'Compare what improved, what still needs work, and what appeared in the new version.',
        previewTitle: 'Context in one place',
        previewDescription: 'Preview, download, comments, and version history stay together.',
        shareTitle: 'Controlled sharing',
        shareDescription: 'Create review links, control access, and revoke them when needed.',
      };

  const aboutItems = [
    { icon: Sparkles, title: copy.feedbackTitle, description: copy.feedbackDescription },
    { icon: History, title: copy.progressTitle, description: copy.progressDescription },
    { icon: Eye, title: copy.previewTitle, description: copy.previewDescription },
    { icon: Share2, title: copy.shareTitle, description: copy.shareDescription },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col">
        <div className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.76fr)]">
          <section className="relative hidden min-h-[calc(100vh-128px)] flex-col overflow-hidden border-r bg-background px-12 py-10 lg:flex">
            <Link to="/" className="flex w-fit items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-lg font-bold text-primary">Resume Feedback</span>
            </Link>

            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8">
              <div className="w-full max-w-3xl space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <BrainCircuit className="h-4 w-4" />
                  {copy.badge}
                </div>

                <p className="max-w-3xl text-2xl leading-9 text-muted-foreground">
                  {copy.intro}
                </p>
              </div>

              <div className="w-full">
                <img
                  src={handshakeFeaturedImage}
                  alt="Handshake AI Showcase featuring Resume Feedback"
                  className="mx-auto w-full max-w-[760px] rounded-xl border bg-muted/20 shadow-2xl"
                />
                <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {copy.featured}
                </p>
              </div>
            </div>
          </section>

          <section className="relative flex min-h-screen items-start justify-center px-5 pb-8 pt-20 lg:min-h-[calc(100vh-128px)] lg:items-center lg:px-12 lg:py-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-5 top-5 h-11 w-11 rounded-full lg:right-8 lg:top-8"
                aria-label="Profile settings"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl rounded-2xl p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl">{copy.removeProfilesTitle}</DialogTitle>
                <DialogDescription>
                  {copy.removeProfilesDescription}
                </DialogDescription>
              </DialogHeader>
              {isAuthenticated ? (
                <div className="mt-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-12 w-12 border bg-muted">
                        <AvatarImage src={profile?.avatarUrl || undefined} alt={profileLabel} />
                        <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
                          {profile?.avatarUrl ? profileInitials : <FileText className="h-5 w-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{profileLabel}</p>
                        <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={handleRemoveSavedProfile}>
                      {copy.remove}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  {copy.noSavedProfile}
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute left-5 top-5 h-10 lg:left-auto lg:right-24 lg:top-8"
            onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
          >
            {copy.language}
          </Button>

          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <Avatar className="mx-auto mb-3 h-16 w-16 border bg-muted shadow-sm sm:h-20 sm:w-20">
                <AvatarImage src={profile?.avatarUrl || undefined} alt={profileLabel} />
                <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                  {profile?.avatarUrl ? profileInitials : <FileText className="h-7 w-7 sm:h-8 sm:w-8" />}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">{profileLabel}</h2>
            </div>

            <Card className="border bg-background shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{copy.workspaceTitle}</CardTitle>
                <CardDescription>
                  {copy.workspaceDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-8 sm:px-8">
                {!showEmailForm ? (
                  <div className="space-y-3">
                    {googleClientId && (
                      <Button
                        variant="outline"
                        className="h-14 w-full gap-3 border-2 text-base"
                        onClick={googleAuth.prompt}
                        disabled={!googleAuth.isReady || isGoogleLoading}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        {copy.google}
                      </Button>
                    )}

                    <Button
                      className="h-14 w-full gap-3 text-base"
                      onClick={() => setShowEmailForm(true)}
                    >
                      <Mail className="h-5 w-5" />
                      {copy.email}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mb-4 -ml-2 gap-1 text-muted-foreground"
                      onClick={() => setShowEmailForm(false)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {copy.back}
                    </Button>
                    <AuthFormTabs
                      isLoading={isLoading}
                      onLogin={handleLogin}
                      onRegister={handleRegister}
                      onReactivate={handleReactivate}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <section id="about-mobile" className="rounded-lg border bg-background p-4 shadow-sm lg:hidden">
              <div className="grid gap-2">
                {aboutItems.map((item) => (
                  <div key={item.title} className="flex items-center gap-2 rounded-md border bg-muted/20 p-3">
                    <item.icon className="h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          </section>
        </div>

        <footer id="about" className="hidden border-t bg-background px-8 py-4 lg:block">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {aboutItems.map((item) => (
              <span key={item.title} className="flex items-center gap-2 whitespace-nowrap">
                <item.icon className="h-4 w-4 text-primary" />
                {item.title}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}
