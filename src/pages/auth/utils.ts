import { MIN_PASSWORD_LENGTH } from './constants';

export function getFormValue(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

export function getRegisterValidationError(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) {
    return 'As senhas nao coincidem';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }

  return null;
}
