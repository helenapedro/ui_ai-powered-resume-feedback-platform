export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Resume {
  _id: string;
  posterId: User;
  format: 'pdf' | 'image';
  url: string;
  description?: string;
  aiFeedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  key: string;
  versionId: string;
  lastModified: string;
  size: number;
  isLatest: boolean;
  name: string;
}

export interface Comment {
  _id: string;
  resumeId: string;
  commenterId: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  resumes: T[];
  totalResumes: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  error?: string;
}
