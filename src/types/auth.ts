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

export type RegisterInput = {
  loginId: string;
  displayName: string;
  password: string;
  passwordConfirm: string;
};

export type RegisterResult = {
  uid: string;
  loginId: string;
  displayName: string;
};

export type RegisterValidationErrors = {
  loginId?: string;
  displayName?: string;
  password?: string;
  passwordConfirm?: string;
};

export type RegisterValidationSuccess = {
  normalizedLoginId: string;
  normalizedDisplayName: string;
  password: string;
};

export type RegisterValidationResult =
  | {
      success: true;
      data: RegisterValidationSuccess;
    }
  | {
      success: false;
      error: AppError;
      fieldErrors: RegisterValidationErrors;
    };

export type InitialCoinProvider = {
  getInitialUserCoin: () => Promise<ServiceResult<number>>;
};

export type RegistrationFailureReporter = {
  reportRollbackFailure: (input: {
    uid: string;
    normalizedLoginId: string;
    cause: unknown;
  }) => Promise<void>;
};

export type RegisterServiceContract = {
  register: (input: RegisterInput) => Promise<ServiceResult<RegisterResult>>;
};

export type LoginResult = {
  uid: string;
};

export type LoginValidationErrors = {
  loginId?: string;
  password?: string;
};

export type LoginValidationSuccess = {
  normalizedLoginId: string;
  password: string;
};

export type LoginValidationResult =
  | {
      success: true;
      data: LoginValidationSuccess;
    }
  | {
      success: false;
      error: AppError;
      fieldErrors?: LoginValidationErrors;
    };

export type LoginServiceContract = {
  login: (input: LoginInput) => Promise<ServiceResult<LoginResult>>;
};

export type LoginEventReporter = {
  reportLoginSuccess: (input: {
    uid: string;
    loginId: string;
  }) => Promise<void>;

  reportLoginFailure: (input: {
    loginId: string;
    reasonCode: string;
  }) => Promise<void>;
};

export type AuthState = {
  authUser: AuthUserSummary | null;
  isAuthenticated: boolean;
  isAuthInitializing: boolean;
  isAuthSubmitting: boolean;
  authError: AppError | null;
};

export type AuthContextActions = {
  login: (input: LoginInput) => Promise<ServiceResult<LoginResult>>;
  register: (input: RegisterInput) => Promise<ServiceResult<RegisterResult>>;
  logout: () => Promise<EmptyServiceResult>;
  clearAuthError: () => void;
};

export type AuthContextValue = AuthState & AuthContextActions;