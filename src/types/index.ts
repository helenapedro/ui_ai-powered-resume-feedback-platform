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

export interface DemoSessionResponse {
  token: string;
  email: string;
  userId: string;
  resumeId: string;
  currentVersionId: string;
  baselineVersionId: string;
}

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

export interface SharedResumeData {
  resumeId: string;
  currentVersionId: string;
  permission: SharePermission;
  expiresAt: string | null;
}

export type AiJobStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

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

export interface AiFeedbackDTO {
  resumeId: string;
  resumeVersionId: string;
  jobId: string;
  feedbackVersion: number;
  mongoDocId: string;
  model: string;
  promptVersion: string | null;
  createdAt: string;
  summary: string;
  strengths: string[];
  improvements: string[];
}

export type AiProgressStatus = string;

export interface AiProgressDTO {
  resumeId: string;
  resumeVersionId: string;
  baselineResumeVersionId: string;
  jobId: string;
  progressVersion: number;
  mongoDocId: string;
  model: string;
  promptVersion: string | null;
  createdAt: string;
  summary: string;
  progressStatus: AiProgressStatus;
  progressScore: number | null;
  score?: number | null;
  improvedAreas: string[];
  unchangedIssues: string[];
  newIssues: string[];
}
