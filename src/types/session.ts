import type { AppError } from './error';

export type AutomaticLogoutReason =
  | 'ACCOUNT_DISABLED'
  | 'USER_DOCUMENT_MISSING'
  | 'USER_DATA_INVALID'
  | 'USER_ACCESS_DENIED'
  | 'SESSION_INVALID';

export type SessionTerminationInfo = {
  reason: AutomaticLogoutReason;
  occurredAt: string;
};

export type SessionLifecycleState = {
  isTerminatingSession: boolean;
  terminationError: AppError | null;
};

export type SessionContextValue = {
  terminationInfo: SessionTerminationInfo | null;
  isTerminatingSession: boolean;
  terminationError: AppError | null;
  clearTerminationInfo: () => void;
};