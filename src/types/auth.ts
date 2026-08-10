import type { Unsubscribe } from 'firebase/auth';

import type { AppError } from './error';
import type { EmptyServiceResult, ServiceResult } from './common';

export type FirebaseAccountInput = {
  normalizedLoginId: string;
  password: string;
};

export type LoginInput = {
  loginId: string;
  password: string;
};

export type RegisterAuthInput = {
  loginId: string;
  password: string;
};

export type AuthUserSummary = {
  uid: string;
};

export type AuthStateChangeHandler = (user: AuthUserSummary | null) => void;

export type AuthServiceContract = {
  initializePersistence: () => Promise<EmptyServiceResult>;

  createAccount: (
    input: RegisterAuthInput,
  ) => Promise<ServiceResult<AuthUserSummary>>;

  login: (input: LoginInput) => Promise<ServiceResult<AuthUserSummary>>;

  logout: () => Promise<EmptyServiceResult>;

  deleteCurrentAccount: () => Promise<EmptyServiceResult>;

  getCurrentUser: () => AuthUserSummary | null;

  subscribeToAuthState: (
    onChange: AuthStateChangeHandler,
    onError?: (error: AppError) => void,
  ) => Unsubscribe;
};