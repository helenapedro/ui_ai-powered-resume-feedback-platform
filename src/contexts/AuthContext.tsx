import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const existingUser = authService.getUser();
    if (existingUser) {
      setUser({
        id: existingUser.id,
        email: existingUser.email,
      });
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const userData = authService.getUser();
    if (userData) {
      setUser({
        id: userData.id,
        email: userData.email,
      });
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const response = await authService.register({ email, password });
    const userData = authService.getUser();
    if (userData) {
      setUser({
        id: userData.id,
        email: userData.email,
      });
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
