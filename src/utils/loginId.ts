import {
  INTERNAL_AUTH_DOMAIN,
  LOGIN_ID_MAX_LENGTH,
  LOGIN_ID_MIN_LENGTH,
  VALIDATION_MESSAGES,
} from '@/constants';
import type { LoginIdValidationResult } from '@/types';

const LOGIN_ID_PATTERN = /^[a-z0-9_]+$/;

export function normalizeLoginId(value: string): string {
  return value.trim().toLowerCase();
}

export function validateLoginId(value: string): LoginIdValidationResult {
  const normalizedLoginId = normalizeLoginId(value);

  const isValidLength =
    normalizedLoginId.length >= LOGIN_ID_MIN_LENGTH &&
    normalizedLoginId.length <= LOGIN_ID_MAX_LENGTH;

  if (!isValidLength || !LOGIN_ID_PATTERN.test(normalizedLoginId)) {
    return {
      success: false,
      message: VALIDATION_MESSAGES.LOGIN_ID_INVALID,
    };
  }

  return {
    success: true,
    normalizedLoginId,
  };
}

export function createInternalEmail(normalizedLoginId: string): string {
  return `${normalizedLoginId}@${INTERNAL_AUTH_DOMAIN}`;
}