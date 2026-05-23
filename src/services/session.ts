import type { User } from '@/types';

const TOKEN_KEY = 'token';
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

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(options: { notify?: boolean } = {}): void {
    localStorage.removeItem(TOKEN_KEY);

    if (options.notify) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
  },

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) {
      return null;
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
