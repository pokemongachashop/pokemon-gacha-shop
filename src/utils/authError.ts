import { AUTH_ERROR_MESSAGES } from '@/constants/authErrors';
import type { AppError, AppErrorCode } from '@/types';

import { createAppError } from './error';

type MappedAuthError = {
  code: AppErrorCode;
  message: string;
};

const AUTH_ERROR_CODE_MAP: Record<string, MappedAuthError> = {
  'auth/invalid-credential': {
    code: 'VALIDATION_ERROR',
    message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL,
  },
  'auth/user-not-found': {
    code: 'VALIDATION_ERROR',
    message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL,
  },
  'auth/wrong-password': {
    code: 'VALIDATION_ERROR',
    message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL,
  },
  'auth/invalid-email': {
    code: 'VALIDATION_ERROR',
    message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL,
  },
  'auth/email-already-in-use': {
    code: 'CONFLICT',
    message: AUTH_ERROR_MESSAGES.ACCOUNT_EXISTS,
  },
  'auth/weak-password': {
    code: 'VALIDATION_ERROR',
    message: AUTH_ERROR_MESSAGES.WEAK_PASSWORD,
  },
  'auth/too-many-requests': {
    code: 'AUTH_ERROR',
    message: AUTH_ERROR_MESSAGES.TOO_MANY_REQUESTS,
  },
  'auth/network-request-failed': {
    code: 'NETWORK_ERROR',
    message: AUTH_ERROR_MESSAGES.NETWORK_ERROR,
  },
  'auth/user-disabled': {
    code: 'AUTH_ERROR',
    message: AUTH_ERROR_MESSAGES.ACCOUNT_DISABLED,
  },
  'auth/requires-recent-login': {
    code: 'AUTH_ERROR',
    message: AUTH_ERROR_MESSAGES.REQUIRES_RECENT_LOGIN,
  },
  'auth/operation-not-allowed': {
    code: 'AUTH_ERROR',
    message: AUTH_ERROR_MESSAGES.OPERATION_NOT_ALLOWED,
  },
};

function isFirebaseAuthErrorLike(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

export function mapFirebaseAuthError(error: unknown): AppError {
  if (!isFirebaseAuthErrorLike(error)) {
    return createAppError('UNKNOWN_ERROR', AUTH_ERROR_MESSAGES.UNKNOWN, {
      developerMessage: 'Unrecognized auth error shape',
    });
  }

  const mapped = AUTH_ERROR_CODE_MAP[error.code];

  if (!mapped) {
    return createAppError('AUTH_ERROR', AUTH_ERROR_MESSAGES.UNKNOWN, {
      developerMessage: `Firebase Auth error: ${error.code}`,
    });
  }

  return createAppError(mapped.code, mapped.message, {
    developerMessage: `Firebase Auth error: ${error.code}`,
    retryable: mapped.code === 'NETWORK_ERROR',
  });
}
