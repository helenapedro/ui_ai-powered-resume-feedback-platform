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
  fileSizeBytes?: number;
  createdById?: string;
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
  resumeVersionId: string;
  authorUserId: string | null;
  authorLabel: string;
  body: string;
  anchorRef?: string | null;
  parentCommentId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  // Legacy fields for backward compatibility
  resumeId?: string;
  commenterId?: User;
  content?: string;
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

export type SharePermission = 'VIEW' | 'COMMENT';

export interface SharedLink {
  id: string;
  token?: string;
  permission: SharePermission;
  expiresAt: string | null;
  revokedAt?: string | null;
  maxUses: number | null;
  useCount?: number;
  createdAt?: string;
  createdBy?: string;
}

// Response from GET /api/share/{token}
export interface SharedResumeData {
  resumeId: string;
  currentVersionId: string;
  permission: SharePermission;
  expiresAt: string | null;
}

// AI Job Status
export type AiJobStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

// AI Job DTO
export interface AiJobDTO {
  id: string;
  resumeVersionId: string;
  status: AiJobStatus;
  attemptCount: number;
  createdAt: string;
  updatedAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  errorCode: string | null;
  errorDetail: string | null;
  nextRetryAt: string | null;
}

// AI Feedback DTO
export interface AiFeedbackDTO {
  resumeId: string;
  resumeVersionId: string;
  jobId: string;
  feedbackVersion: number;
  mongoDocId: string;
  model: string;
  promptVersion: string;
  createdAt: string;
  summary: string;
  strengths: string[];
  improvements: string[];
}
