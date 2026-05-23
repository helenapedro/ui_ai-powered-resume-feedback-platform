import React, { useEffect, useMemo } from 'react';
import { initializeAuth, login, loginWithGoogle, logout, register } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sessionService } from '@/services/session';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      void dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(logout());
    };

    window.addEventListener(sessionService.expiredEventName, handleSessionExpired);
    return () => window.removeEventListener(sessionService.expiredEventName, handleSessionExpired);
  }, [dispatch]);

  return <>{children}</>;
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  return useMemo<AuthContextType>(
    () => ({
      user: user as User | null,
      isAuthenticated: !!user,
      isLoading,
      login: async (email: string, password: string) => {
        await dispatch(login({ email, password })).unwrap();
      },
      register: async (email: string, password: string) => {
        await dispatch(register({ email, password })).unwrap();
      },
      loginWithGoogle: async (idToken: string) => {
        await dispatch(loginWithGoogle(idToken)).unwrap();
      },
      logout: () => {
        dispatch(logout());
      },
    }),
    [dispatch, isLoading, user]
  );
}
