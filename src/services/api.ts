const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://janett-achlamydate-springingly.ngrok-free.dev/api';

// API Error Response interface
export interface ApiErrorResponse {
  code: string;
  message: string;
  status: number;
  path: string;
  timestamp: string;
  traceId: string;
  details?: {
    fieldErrors?: Record<string, string>;
  };
}

// Custom API Error class
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: { fieldErrors?: Record<string, string> }
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Share link expired/revoked/exhausted error (410)
export class ShareLinkGoneError extends ApiError {
  constructor(message: string = 'Este link de partilha expirou ou foi revogado.') {
    super('SHARE_LINK_GONE', message, 410);
    this.name = 'ShareLinkGoneError';
  }
}

// Rate limit error (429)
export class RateLimitError extends ApiError {
  constructor(
    message: string = 'Demasiados pedidos. Tente novamente mais tarde.',
    public retryAfter: string | null = null
  ) {
    super('RATE_LIMITED', message, 429);
    this.name = 'RateLimitError';
  }
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'ngrok-skip-browser-warning': 'true',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({
        code: 'UNKNOWN_ERROR',
        message: 'An error occurred',
        status: response.status,
        path: endpoint,
        timestamp: new Date().toISOString(),
        traceId: '',
      }));

      // Handle specific HTTP status codes
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

    return response.json();
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

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
