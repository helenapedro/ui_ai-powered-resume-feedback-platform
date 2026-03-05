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
  async getMe(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/users/me');
  },

  async updateMe(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/users/me', data);
  },
};
