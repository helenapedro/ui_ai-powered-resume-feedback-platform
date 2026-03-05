import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthFormTabs } from '@/pages/auth/AuthFormTabs';
import { GoogleAuthSection } from '@/pages/auth/GoogleAuthSection';
import { DEFAULT_REDIRECT } from '@/pages/auth/constants';
import { useAuthPageActions } from '@/pages/auth/useAuthPageActions';
import { useGoogleGsiButton } from '@/pages/auth/useGoogleGsiButton';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || DEFAULT_REDIRECT;
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const {
    isLoading,
    isGoogleLoading,
    handleLogin,
    handleRegister,
    handleReactivate,
    handleGoogleCredential,
    showMissingGoogleCredentialError,
  } = useAuthPageActions({ redirectTo });

  useGoogleGsiButton({
    clientId: googleClientId,
    containerRef: googleButtonRef,
    onCredential: handleGoogleCredential,
    onMissingCredential: showMissingGoogleCredentialError,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Resume Feedback</CardTitle>
          <CardDescription>
            Obtenha feedback valioso para seu curriculo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthFormTabs
            isLoading={isLoading}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onReactivate={handleReactivate}
          />
          <GoogleAuthSection
            clientId={googleClientId}
            isGoogleLoading={isGoogleLoading}
            buttonContainerRef={googleButtonRef}
          />
        </CardContent>
      </Card>
    </div>
  );
}
