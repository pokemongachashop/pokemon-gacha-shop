import type { AppError, AppErrorCode } from '@/types';

export function createAppError(
  code: AppErrorCode,
  userMessage: string,
  options?: {
    developerMessage?: string;
    retryable?: boolean;
    metadata?: Record<string, unknown>;
    cause?: unknown;
  },
): AppError {
  return {
    code,
    userMessage,
    developerMessage: options?.developerMessage,
    retryable: options?.retryable ?? false,
    metadata: options?.metadata,
    cause: options?.cause,
  };
}

export function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'userMessage' in value &&
    'retryable' in value
  );
}