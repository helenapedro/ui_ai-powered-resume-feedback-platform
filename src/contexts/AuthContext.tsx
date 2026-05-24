import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/auth-context';
import { authService } from '@/services/auth';
import { sessionService } from '@/services/session';
import type { User } from '@/types';

function getStoredUser(): User | null {
  const storedUser = authService.getUser();
  if (!storedUser) {
    return null;
  }

  return {
    id: storedUser.id,
    email: storedUser.email,
    isAdmin: storedUser.isAdmin,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener(sessionService.expiredEventName, handleSessionExpired);
    return () => window.removeEventListener(sessionService.expiredEventName, handleSessionExpired);
  }, []);

  const runAuthTask = useCallback(async (task: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await task();
      setUser(getStoredUser());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      await runAuthTask(() => authService.login({ email, password }));
    },
    [runAuthTask]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      await runAuthTask(() => authService.register({ email, password }));
    },
    [runAuthTask]
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      await runAuthTask(() => authService.loginWithGoogle(idToken));
    },
    [runAuthTask]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [isLoading, login, loginWithGoogle, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
