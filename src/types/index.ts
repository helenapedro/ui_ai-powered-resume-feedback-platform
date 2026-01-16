export interface User {
  id: string;
  username?: string;
  email: string;
  isAdmin?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Spring Boot Resume DTOs
export interface ResumeSummary {
  id: string;
  title: string;
  currentVersionId: string | null;
  createdAt: string;
}

export interface ResumeVersion {
  id: string;
  versionNumber: number;
  originalFilename: string;
  contentType: string;
  createdAt: string;
}

export interface ResumeWithVersions {
  resume: ResumeSummary;
  versions: ResumeVersion[];
}

// Legacy Resume interface for backward compatibility
export interface Resume {
  _id?: string;
  id: string;
  title: string;
  currentVersionId: string | null;
  posterId?: User;
  format?: 'pdf' | 'image';
  url?: string;
  description?: string;
  aiFeedback?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  _id?: string;
  resumeId: string;
  resumeVersionId?: string;
  commenterId?: User;
  content: string;
  createdAt: string;
  updatedAt?: string;
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
