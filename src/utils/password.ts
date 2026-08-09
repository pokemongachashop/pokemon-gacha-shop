import { PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES } from '@/constants';
import type { PasswordValidationResult } from '@/types';

const HAS_LETTER_PATTERN = /[a-zA-Z]/;
const HAS_NUMBER_PATTERN = /[0-9]/;

export function validatePassword(
  password: string,
  normalizedLoginId?: string,
): PasswordValidationResult {
  const hasSurroundingWhitespace = password !== password.trim();

  const isValidLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasLetter = HAS_LETTER_PATTERN.test(password);
  const hasNumber = HAS_NUMBER_PATTERN.test(password);

  if (hasSurroundingWhitespace || !isValidLength || !hasLetter || !hasNumber) {
    return {
      success: false,
      message: VALIDATION_MESSAGES.PASSWORD_INVALID,
    };
  }

  if (
    normalizedLoginId &&
    password.toLowerCase() === normalizedLoginId.toLowerCase()
  ) {
    return {
      success: false,
      message: VALIDATION_MESSAGES.PASSWORD_INVALID,
    };
  }

  return { success: true };
}

export function doPasswordsMatch(
  password: string,
  passwordConfirm: string,
): boolean {
  return password === passwordConfirm;
}