import { z } from 'zod';

import { AUTH_ERROR_MESSAGES } from '@/constants';

export const loginSchema = z.object({
  loginId: z.string().trim().min(1, AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL),
  password: z.string().min(1, AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL),
});

export type LoginFormValues = z.infer<typeof loginSchema>;