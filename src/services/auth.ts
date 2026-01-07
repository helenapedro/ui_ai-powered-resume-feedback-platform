import { apiClient } from './api';
import type { AuthResponse, User } from '@/types';

export const authService = {
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      username,
      email,
      password,
    });
    localStorage.setItem('token', response.token);
    return response;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('token', response.token);
    return response;
  },

  async getUser(userId: string): Promise<User> {
    return apiClient.get<User>(`/auth/user/${userId}`);
  },

  async updateUser(email: string): Promise<{ message: string; user: User }> {
    return apiClient.put('/auth/user/update', { email });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.post('/auth/user/change-password', {
      currentPassword,
      newPassword,
    });
  },

  async deleteAccount(): Promise<{ message: string }> {
    return apiClient.delete('/auth/user/delete');
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
