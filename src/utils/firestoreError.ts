import type { AppError, AppErrorCode } from '@/types';

import { createAppError } from './error';

const FIRESTORE_ERROR_MESSAGES = {
  PERMISSION_DENIED: '이 작업을 수행할 권한이 없습니다.',
  UNAVAILABLE: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
  NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
  ALREADY_EXISTS: '이미 존재하는 데이터입니다.',
  ABORTED: '다른 작업과 충돌했습니다. 다시 시도해주세요.',
  CANCELLED: '요청이 취소되었습니다.',
  DEADLINE_EXCEEDED: '요청 시간이 초과되었습니다.',
  FAILED_PRECONDITION: '현재 상태에서는 작업을 수행할 수 없습니다.',
  INVALID_ARGUMENT: '요청 값이 올바르지 않습니다.',
  RESOURCE_EXHAUSTED: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  UNAUTHENTICATED: '로그인이 필요합니다.',
  INTERNAL: '서버 오류가 발생했습니다.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
} as const;

type MappedFirestoreError = {
  code: AppErrorCode;
  message: string;
  retryable: boolean;
};

const FIRESTORE_ERROR_CODE_MAP: Record<string, MappedFirestoreError> = {
  'permission-denied': {
    code: 'PERMISSION_DENIED',
    message: FIRESTORE_ERROR_MESSAGES.PERMISSION_DENIED,
    retryable: false,
  },
  unavailable: {
    code: 'NETWORK_ERROR',
    message: FIRESTORE_ERROR_MESSAGES.UNAVAILABLE,
    retryable: true,
  },
  'not-found': {
    code: 'NOT_FOUND',
    message: FIRESTORE_ERROR_MESSAGES.NOT_FOUND,
    retryable: false,
  },
  'already-exists': {
    code: 'CONFLICT',
    message: FIRESTORE_ERROR_MESSAGES.ALREADY_EXISTS,
    retryable: false,
  },
  aborted: {
    code: 'CONFLICT',
    message: FIRESTORE_ERROR_MESSAGES.ABORTED,
    retryable: true,
  },
  cancelled: {
    code: 'INTERNAL_ERROR',
    message: FIRESTORE_ERROR_MESSAGES.CANCELLED,
    retryable: true,
  },
  'deadline-exceeded': {
    code: 'NETWORK_ERROR',
    message: FIRESTORE_ERROR_MESSAGES.DEADLINE_EXCEEDED,
    retryable: true,
  },
  'failed-precondition': {
    code: 'VALIDATION_ERROR',
    message: FIRESTORE_ERROR_MESSAGES.FAILED_PRECONDITION,
    retryable: false,
  },
  'invalid-argument': {
    code: 'VALIDATION_ERROR',
    message: FIRESTORE_ERROR_MESSAGES.INVALID_ARGUMENT,
    retryable: false,
  },
  'resource-exhausted': {
    code: 'NETWORK_ERROR',
    message: FIRESTORE_ERROR_MESSAGES.RESOURCE_EXHAUSTED,
    retryable: true,
  },
  unauthenticated: {
    code: 'PERMISSION_DENIED',
    message: FIRESTORE_ERROR_MESSAGES.UNAUTHENTICATED,
    retryable: false,
  },
  internal: {
    code: 'INTERNAL_ERROR',
    message: FIRESTORE_ERROR_MESSAGES.INTERNAL,
    retryable: false,
  },
  unknown: {
    code: 'UNKNOWN_ERROR',
    message: FIRESTORE_ERROR_MESSAGES.UNKNOWN,
    retryable: false,
  },
};

function isFirestoreErrorLike(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

export function mapFirestoreError(error: unknown): AppError {
  if (!isFirestoreErrorLike(error)) {
    return createAppError('UNKNOWN_ERROR', FIRESTORE_ERROR_MESSAGES.UNKNOWN, {
      developerMessage: 'Unrecognized Firestore error shape',
    });
  }

  const mapped = FIRESTORE_ERROR_CODE_MAP[error.code];

  if (!mapped) {
    return createAppError('UNKNOWN_ERROR', FIRESTORE_ERROR_MESSAGES.UNKNOWN, {
      developerMessage: `Firestore error: ${error.code}`,
    });
  }

  return createAppError(mapped.code, mapped.message, {
    developerMessage: `Firestore error: ${error.code}`,
    retryable: mapped.retryable,
  });
}