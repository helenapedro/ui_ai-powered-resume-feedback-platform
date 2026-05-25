import { apiClient } from './api';
import { sessionService } from './session';
import { buildApiUrl } from './api-config';
import { parseApiError, throwApiError } from './api-errors';
import type { DemoSessionResponse, User } from '@/types';

interface AuthResponse {
  accessToken: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

export const authService = {
  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    return authenticate('/auth/register', credentials);
  },

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    return authenticate('/auth/login', credentials);
  },

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    return authenticate('/auth/google', { idToken });
  },

  async reactivate(credentials: AuthCredentials): Promise<AuthResponse> {
    return authenticate('/auth/reactivate', credentials);
  },

  async startDemoSession(): Promise<DemoSessionResponse> {
    sessionService.clearToken();

    const response = await fetch(buildApiUrl('/demo/session'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await parseApiError(response, '/demo/session');
      throwApiError(response, errorData);
    }

    const demo = (await response.json()) as DemoSessionResponse;

    sessionService.setToken(demo.token, {
      id: demo.userId,
      email: demo.email,
    });

    return demo;
  },

  logout(): void {
    sessionService.clearToken();
  },

  getToken(): string | null {
    return sessionService.getToken();
  },

  isAuthenticated(): boolean {
    return sessionService.isAuthenticated();
  },

  getUser() {
    return sessionService.getCurrentUser();
  },
};

async function authenticate(endpoint: string, data: unknown): Promise<AuthResponse> {
  sessionService.clearToken();
  const response = await apiClient.post<AuthResponse>(endpoint, data);

  if (response.accessToken) {
    sessionService.setToken(response.accessToken, getUserFromToken(response.accessToken));
  }

  return response;
}

function getUserFromToken(token: string): Pick<User, 'id' | 'email' | 'isAdmin'> | null {
  const payloadPart = token.split('.')[1];

  if (!payloadPart) {
    return null;
  }

  try {
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const payload = JSON.parse(atob(padded)) as { sub?: string; email?: string; role?: string };

    if (!payload.sub || !payload.email) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      isAdmin: payload.role === 'ADMIN',
    };
  } catch {
    return null;
  }
}
