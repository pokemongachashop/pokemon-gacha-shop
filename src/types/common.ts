import type { AppError } from './error';

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

export type LoadingState = {
  status: AsyncStatus;
  error: Nullable<string>;
};

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

export type EmptyServiceResult =
  | { success: true }
  | { success: false; error: AppError };