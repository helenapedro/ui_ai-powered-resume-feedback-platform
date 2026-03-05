import { apiClient } from './api';

interface AuthResponse {
  accessToken: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

export const authService = {
  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    localStorage.removeItem('token');

    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken);
    }
    return response;
  },

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    localStorage.removeItem('token');
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken);
    }
    return response;
  },

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    localStorage.removeItem('token');
    const response = await apiClient.post<AuthResponse>('/auth/google', { idToken });
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken);
    }
    return response;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Decode JWT to get user info (without verification)
  getUser(): { id: string; email: string; role: string } | null {
    const token = this.getToken();

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  },
};
