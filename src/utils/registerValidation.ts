import { VALIDATION_MESSAGES } from '@/constants';
import type {
  RegisterInput,
  RegisterValidationErrors,
  RegisterValidationResult,
} from '@/types';

import { createAppError } from './error';
import { validateDisplayName } from './displayName';
import { validateLoginId } from './loginId';
import { doPasswordsMatch, validatePassword } from './password';

export function validateRegisterInput(
  input: RegisterInput,
): RegisterValidationResult {
  const loginIdResult = validateLoginId(input.loginId);
  const displayNameResult = validateDisplayName(input.displayName);
  const passwordResult = validatePassword(
    input.password,
    loginIdResult.success ? loginIdResult.normalizedLoginId : undefined,
  );
  const passwordConfirmMatches = doPasswordsMatch(
    input.password,
    input.passwordConfirm,
  );

  const fieldErrors: RegisterValidationErrors = {};

  if (!loginIdResult.success) {
    fieldErrors.loginId = loginIdResult.message;
  }
  if (!displayNameResult.success) {
    fieldErrors.displayName = displayNameResult.message;
  }
  if (!passwordResult.success) {
    fieldErrors.password = passwordResult.message;
  }
  if (!passwordConfirmMatches) {
    fieldErrors.passwordConfirm =
      VALIDATION_MESSAGES.PASSWORD_CONFIRM_MISMATCH;
  }

  if (
    !loginIdResult.success ||
    !displayNameResult.success ||
    !passwordResult.success ||
    !passwordConfirmMatches
  ) {
    const firstErrorMessage =
      fieldErrors.loginId ??
      fieldErrors.displayName ??
      fieldErrors.password ??
      fieldErrors.passwordConfirm ??
      '입력값을 확인해주세요.';

    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', firstErrorMessage),
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      normalizedLoginId: loginIdResult.normalizedLoginId,
      normalizedDisplayName: displayNameResult.normalizedDisplayName,
      password: input.password,
    },
  };
}