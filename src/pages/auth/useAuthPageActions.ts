import { useCallback, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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

  const handleGoogleCredential = useCallback(
    async (idToken: string) => {
      setIsGoogleLoading(true);
      try {
        await loginWithGoogle(idToken);
        toast({
          title: 'Login com Google realizado!',
          description: 'Bem-vindo de volta.',
        });
        navigate(redirectTo);
      } catch (error) {
        showErrorToast('Erro no login com Google', error, 'Nao foi possivel autenticar com Google');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [loginWithGoogle, navigate, redirectTo, showErrorToast, toast]
  );

  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = getFormValue(formData, 'email');
      const password = getFormValue(formData, 'password');

      await runAuthTask(() => login(email, password), {
        successTitle: 'Login realizado!',
        successDescription: 'Bem-vindo de volta.',
        errorTitle: 'Erro no login',
        fallbackError: 'Credenciais invalidas',
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
          title: 'Erro',
          description: validationError,
          variant: 'destructive',
        });
        return;
      }

      await runAuthTask(() => register(email, password), {
        successTitle: 'Conta criada!',
        successDescription: 'Voce foi autenticado automaticamente.',
        errorTitle: 'Erro no registro',
        fallbackError: 'Nao foi possivel criar a conta',
      });
    },
    [register, runAuthTask, toast]
  );

  return {
    isLoading,
    isGoogleLoading,
    handleLogin,
    handleRegister,
    handleGoogleCredential,
    showMissingGoogleCredentialError: () =>
      showErrorToast(
        'Erro no login com Google',
        null,
        'Nao foi recebido um token de autenticacao do Google.'
      ),
  };
}
