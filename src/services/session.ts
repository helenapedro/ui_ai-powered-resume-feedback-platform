import type { User } from '@/types';

const TOKEN_KEY = 'token';
const USER_KEY = 'session-user';
const SESSION_EXPIRED_EVENT = 'session:expired';

type JwtPayload = {
  sub?: string;
  email?: string;
  role?: string;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const payloadPart = token.split('.')[1];
  if (!payloadPart) {
    return null;
  }

  try {
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

export const sessionService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string, user?: Pick<User, 'id' | 'email' | 'isAdmin'> | null): void {
    localStorage.setItem(TOKEN_KEY, token);

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(USER_KEY);
  },

  clearToken(options: { notify?: boolean } = {}): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    if (options.notify) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
  },

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    const payload = decodeJwtPayload(token);
    if (!payload?.sub || !payload.email) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      isAdmin: payload.role === 'ADMIN',
    };
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },

  expiredEventName: SESSION_EXPIRED_EVENT,
};
