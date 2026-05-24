import { useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/users';
import { authService } from '@/services/auth';
import type { AuthTaskMessages } from './constants';
import { getFormValue, getRegisterValidationError } from './utils';

type UseAuthPageActionsParams = {
  redirectTo: string;
};

export function useAuthPageActions({ redirectTo }: UseAuthPageActionsParams) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const showErrorToast = useCallback(
    (title: string, error: unknown, fallbackError: string) => {
      toast({
        title,
        description: error instanceof Error ? error.message : fallbackError,
        variant: 'destructive',
      });
    },
    [toast]
  );

  const runAuthTask = useCallback(
    async (action: () => Promise<void>, messages: AuthTaskMessages) => {
      setIsLoading(true);
      try {
        await action();
        toast({
          title: messages.successTitle,
          description: messages.successDescription,
        });
        navigate(redirectTo);
      } catch (error) {
        showErrorToast(messages.errorTitle, error, messages.fallbackError);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, redirectTo, showErrorToast, toast]
  );

  const decodeGoogleName = useCallback((idToken: string): string | null => {
    try {
      const payloadPart = idToken.split('.')[1];
      if (!payloadPart) return null;
      const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      const payload = JSON.parse(atob(padded)) as { name?: string; given_name?: string };
      const name = payload.name?.trim() || payload.given_name?.trim() || '';
      return name || null;
    } catch {
      return null;
    }
  }, []);

  const trySetGoogleFullName = useCallback(async (idToken: string) => {
    const googleName = decodeGoogleName(idToken);
    if (!googleName) return;

    try {
      const me = await userService.getMe();
      if (!me.fullName || !me.fullName.trim()) {
        await userService.updateMe({ fullName: googleName });
      }
    } catch {
      return;
    }
  }, [decodeGoogleName]);

  const handleGoogleCredential = useCallback(
    async (idToken: string) => {
      setIsGoogleLoading(true);
      try {
        await loginWithGoogle(idToken);
        await trySetGoogleFullName(idToken);
        toast({
          title: 'Signed in with Google',
          description: 'Welcome back.',
        });
        navigate(redirectTo);
      } catch (error) {
        showErrorToast('Google sign-in failed', error, 'Unable to authenticate with Google.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [loginWithGoogle, navigate, redirectTo, showErrorToast, toast, trySetGoogleFullName]
  );

  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = getFormValue(formData, 'email');
      const password = getFormValue(formData, 'password');

      await runAuthTask(() => login(email, password), {
        successTitle: 'Signed in',
        successDescription: 'Welcome back.',
        errorTitle: 'Login failed',
        fallbackError: 'Invalid credentials.',
      });
    },
    [login, runAuthTask]
  );

  const handleRegister = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = getFormValue(formData, 'email');
      const password = getFormValue(formData, 'password');
      const confirmPassword = getFormValue(formData, 'confirmPassword');
      const validationError = getRegisterValidationError(password, confirmPassword);

      if (validationError) {
        toast({
          title: 'Registration error',
          description: validationError,
          variant: 'destructive',
        });
        return;
      }

      await runAuthTask(() => register(email, password), {
        successTitle: 'Account created',
        successDescription: 'You have been signed in automatically.',
        errorTitle: 'Registration failed',
        fallbackError: 'Unable to create your account.',
      });
    },
    [register, runAuthTask, toast]
  );

  const handleReactivate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = getFormValue(formData, 'email');
      const password = getFormValue(formData, 'password');

      await runAuthTask(async () => { await authService.reactivate({ email, password }); }, {
        successTitle: 'Account reactivated',
        successDescription: 'Your account has been successfully reactivated.',
        errorTitle: 'Reactivation failed',
        fallbackError: 'Unable to reactivate your account.',
      });
    },
    [runAuthTask]
  );

  return {
    isLoading,
    isGoogleLoading,
    handleLogin,
    handleRegister,
    handleReactivate,
    handleGoogleCredential,
    showMissingGoogleCredentialError: () =>
      showErrorToast(
        'Google sign-in failed',
        null,
        'No authentication token was received from Google.'
      ),
  };
}
