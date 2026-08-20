import { z } from 'zod';

import {
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  LOGIN_ID_MAX_LENGTH,
  LOGIN_ID_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  VALIDATION_MESSAGES,
} from '@/constants';

const LOGIN_ID_PATTERN = /^[a-z0-9_]+$/i;
const HAS_LETTER_PATTERN = /[a-zA-Z]/;
const HAS_NUMBER_PATTERN = /[0-9]/;

export const registerSchema = z
  .object({
    loginId: z
      .string()
      .trim()
      .min(LOGIN_ID_MIN_LENGTH, VALIDATION_MESSAGES.LOGIN_ID_INVALID)
      .max(LOGIN_ID_MAX_LENGTH, VALIDATION_MESSAGES.LOGIN_ID_INVALID)
      .regex(LOGIN_ID_PATTERN, VALIDATION_MESSAGES.LOGIN_ID_INVALID),
    displayName: z
      .string()
      .trim()
      .min(DISPLAY_NAME_MIN_LENGTH, VALIDATION_MESSAGES.DISPLAY_NAME_INVALID)
      .max(DISPLAY_NAME_MAX_LENGTH, VALIDATION_MESSAGES.DISPLAY_NAME_INVALID),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_INVALID)
      .regex(HAS_LETTER_PATTERN, VALIDATION_MESSAGES.PASSWORD_INVALID)
      .regex(HAS_NUMBER_PATTERN, VALIDATION_MESSAGES.PASSWORD_INVALID),
    passwordConfirm: z
      .string()
      .min(1, VALIDATION_MESSAGES.PASSWORD_CONFIRM_MISMATCH),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: VALIDATION_MESSAGES.PASSWORD_CONFIRM_MISMATCH,
    path: ['passwordConfirm'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;