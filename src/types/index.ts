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
  _id: string;
  resumeId: string;
  format: 'pdf' | 'image';
  url: string;
  description?: string;
  aiFeedback: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  resumeId: string;
  commenterId: User;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<Resume> {
  resumes: Resume[];
  totalResumes: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  error?: string;
}
