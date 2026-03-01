import { apiClient } from './api';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

export const userService = {
  // Get current user profile (JWT)
  async getMe(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/users/me');
  },

  // Update current user profile (JWT)
  async updateMe(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/users/me', data);
  },
};
