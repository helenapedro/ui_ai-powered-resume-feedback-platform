import { apiClient } from './api';
import { sessionService } from './session';

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
    sessionService.setToken(response.accessToken);
  }

  return response;
}
