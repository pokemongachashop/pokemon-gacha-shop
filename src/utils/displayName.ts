import {
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  VALIDATION_MESSAGES,
} from '@/constants';
import type { DisplayNameValidationResult } from '@/types';

import { normalizeSingleLineText } from './string';

export function validateDisplayName(
  value: string,
): DisplayNameValidationResult {
  const normalizedDisplayName = normalizeSingleLineText(value);

  const isValidLength =
    normalizedDisplayName.length >= DISPLAY_NAME_MIN_LENGTH &&
    normalizedDisplayName.length <= DISPLAY_NAME_MAX_LENGTH;

  if (!isValidLength) {
    return {
      success: false,
      message: VALIDATION_MESSAGES.DISPLAY_NAME_INVALID,
    };
  }

  return { success: true, normalizedDisplayName };
}