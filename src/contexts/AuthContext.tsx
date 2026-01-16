import React, { createContext, useContext } from 'react';
import type { User } from '@/types';

// Fixed user for development (no JWT yet)
const FIXED_USER: User = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'fixed-owner@local.dev',
  username: 'Dev User',
};

interface AuthContextType {
  user: User;
  isAuthenticated: true;
  isLoading: false;
}

const AuthContext = createContext<AuthContextType>({
  user: FIXED_USER,
  isAuthenticated: true,
  isLoading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: FIXED_USER,
        isAuthenticated: true,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
