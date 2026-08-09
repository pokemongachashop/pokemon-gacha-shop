export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'CONFLICT'
  | 'NETWORK_ERROR'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN_ERROR';

export type AppError = {
  code: AppErrorCode;
  userMessage: string;
  developerMessage?: string;
  retryable: boolean;
  metadata?: Record<string, unknown>;
  cause?: unknown;
};