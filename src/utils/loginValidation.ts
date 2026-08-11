import { AUTH_ERROR_MESSAGES } from '@/constants';
import type { LoginInput, LoginValidationResult } from '@/types';

import { createAppError } from './error';
import { validateLoginId } from './loginId';

export function validateLoginInput(input: LoginInput): LoginValidationResult {
  const loginIdResult = validateLoginId(input.loginId);

  if (!loginIdResult.success) {
    return {
      success: false,
      error: createAppError(
        'VALIDATION_ERROR',
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL,
      ),
      fieldErrors: { loginId: AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL },
    };
  }

  if (input.password.length === 0) {
    return {
      success: false,
      error: createAppError(
        'VALIDATION_ERROR',
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL,
      ),
      fieldErrors: { password: AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL },
    };
  }

  return {
    success: true,
    data: {
      normalizedLoginId: loginIdResult.normalizedLoginId,
      password: input.password,
    },
  };
}