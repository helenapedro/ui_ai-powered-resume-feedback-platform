export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Resume {
  id: string;
  userId: string;
  username: string;
  filePath: string;
  fileType: string;
  description: string | null;
  aiGeneratedFeedback: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  filePath: string;
  fileType: string;
  description: string | null;
  aiGeneratedFeedback: string | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  resumeId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ApiError {
  message: string;
  error?: string;
}
