import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Mail, ArrowLeft, Settings, BrainCircuit } from 'lucide-react';
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
import handshakeFeaturedImage from '../../docs/project-images/handshake_featured.png';

export default function Auth() {
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

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.76fr)]">
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r bg-background p-12 lg:flex">
          <Link to="/" className="flex w-fit items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold text-primary">Resume Feedback</span>
          </Link>

          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 py-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <BrainCircuit className="h-4 w-4" />
                AI Resume Review with Version Tracking
              </div>

              <div className="space-y-5">
                <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                  Upload drafts, track feedback, collect comments, and share the exact version under review.
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
                <img
                  src={handshakeFeaturedImage}
                  alt="Resume Feedback featured in the Handshake AI Showcase"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Featured in the Handshake AI Showcase
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 lg:px-12">
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
                <DialogTitle className="text-2xl">Remove profiles from this browser</DialogTitle>
                <DialogDescription>
                  Remove saved access on this device. You can sign in again at any time.
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
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  No saved profile was found in this browser.
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <Avatar className="mx-auto mb-5 h-24 w-24 border bg-muted shadow-sm">
                <AvatarImage src={profile?.avatarUrl || undefined} alt={profileLabel} />
                <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                  {profile?.avatarUrl ? profileInitials : <FileText className="h-9 w-9" />}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-foreground">{profileLabel}</h2>
            </div>

            <Card className="border bg-background shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enter your workspace</CardTitle>
                <CardDescription>
                  Sign in to manage resumes, versions, feedback, and shared reviews.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
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
                        Continue with Google
                      </Button>
                    )}

                    <Button
                      className="h-14 w-full gap-3 text-base"
                      onClick={() => setShowEmailForm(true)}
                    >
                      <Mail className="h-5 w-5" />
                      Continue with Email
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
                      Back
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
          </div>
        </section>
      </div>
    </main>
  );
}
