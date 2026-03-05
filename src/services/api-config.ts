const DEFAULT_API_BASE_URL = 'https://resumefeedback-api.hmpedro.com';
const rawApiBaseUrl = import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL;
const sanitizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');

export const API_BASE_URL = sanitizedApiBaseUrl.endsWith('/api')
  ? sanitizedApiBaseUrl.slice(0, -4)
  : sanitizedApiBaseUrl;

export const API_PREFIX = '/api';

export function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${API_PREFIX}${endpoint}`;
}
