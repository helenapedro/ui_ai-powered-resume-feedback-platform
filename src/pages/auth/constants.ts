export const DEFAULT_REDIRECT = '/my-resumes';
export const MIN_PASSWORD_LENGTH = 6;
export const GOOGLE_GSI_SCRIPT = 'https://accounts.google.com/gsi/client';

export const GOOGLE_BUTTON_OPTIONS = {
  theme: 'outline',
  size: 'large',
  text: 'continue_with',
  shape: 'rectangular',
  width: 360,
} as const;

export type AuthTaskMessages = {
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  fallbackError: string;
};
