import { createContext } from 'react';
import type { DemoSessionResponse, User } from '@/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  startDemo: () => Promise<DemoSessionResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
