export interface ApiErrorDetails {
  fieldErrors?: Record<string, string>;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  status: number;
  path: string;
  timestamp: string;
  traceId: string;
  details?: ApiErrorDetails;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: ApiErrorDetails
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ShareLinkGoneError extends ApiError {
  constructor(message: string = 'Este link de partilha expirou ou foi revogado.') {
    super('SHARE_LINK_GONE', message, 410);
    this.name = 'ShareLinkGoneError';
  }
}

export class RateLimitError extends ApiError {
  constructor(
    message: string = 'Demasiados pedidos. Tente novamente mais tarde.',
    public retryAfter: string | null = null
  ) {
    super('RATE_LIMITED', message, 429);
    this.name = 'RateLimitError';
  }
}

export async function parseApiError(response: Response, endpoint: string): Promise<ApiErrorResponse> {
  return response.json().catch(() => ({
    code: 'UNKNOWN_ERROR',
    message: 'An error occurred',
    status: response.status,
    path: endpoint,
    timestamp: new Date().toISOString(),
    traceId: '',
  }));
}

export function throwApiError(
  response: Response,
  errorData: ApiErrorResponse
): never {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    window.location.href = '/auth';
    throw new ApiError(errorData.code, errorData.message, response.status, errorData.details);
  }

  if (response.status === 410) {
    throw new ShareLinkGoneError(errorData.message);
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    throw new RateLimitError(errorData.message, retryAfter);
  }

  throw new ApiError(
    errorData.code,
    errorData.message,
    response.status,
    errorData.details
  );
}
