import { buildApiUrl } from './api-config';
import { parseApiError, throwApiError } from './api-errors';
import { sessionService } from './session';

function getAuthToken(): string | null {
  return sessionService.getToken();
}

function buildHeaders(options: RequestInit, token: string | null): HeadersInit {
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  return headers;
}

async function parseResponseBody<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text);
}

const QUIET_ERROR_CODES = new Set([
  'AI_FEEDBACK_NOT_FOUND',
  'AI_PROGRESS_NOT_FOUND',
  'TARGETED_REVIEW_NOT_FOUND',
  'TARGETED_REVIEW_JOB_NOT_FOUND',
  'TARGETED_COMPARISON_NOT_FOUND',
  'TARGETED_COMPARISON_JOB_NOT_FOUND',
]);

function shouldLogApiError(code?: string) {
  return !code || !QUIET_ERROR_CODES.has(code);
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers = buildHeaders(options, token);
    const response = await fetch(buildApiUrl(endpoint), { ...options, headers });

    if (!response.ok) {
      const errorData = await parseApiError(response, endpoint);

      if (errorData.traceId && shouldLogApiError(errorData.code)) {
        console.error(`[API Error] traceId: ${errorData.traceId} | ${errorData.code} | ${endpoint}`);
      }

      throwApiError(response, errorData);
    }

    return parseResponseBody<T>(response);
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
