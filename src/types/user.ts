import type { UserRole } from '@/constants';

import type { AppError } from './error';
import type { EmptyServiceResult, ServiceResult } from './common';
import type { Unsubscribe } from './firestore';
import type { FirestoreTimestamp } from './firestore';

export type UserProfile = {
  uid: string;

  loginId: string;
  normalizedLoginId: string;
  displayName: string;

  role: UserRole;
  coin: number;
  currentPackId: string | null;
  isActive: boolean;

  createdAt: FirestoreTimestamp | null;
  createdAtKST: string;

  updatedAt: FirestoreTimestamp | null;
  updatedAtKST: string;

  lastLoginAt: FirestoreTimestamp | null;
  lastLoginAtKST: string | null;
};

export type CreateUserProfileInput = {
  uid: string;
  loginId: string;
  normalizedLoginId: string;
  displayName: string;
  initialCoin: number;
};

export type UsernameMapping = {
  uid: string;
  loginId: string;
  normalizedLoginId: string;

  createdAt: FirestoreTimestamp | null;
  createdAtKST: string;
};

export type UserServiceContract = {
  getUser: (uid: string) => Promise<ServiceResult<UserProfile>>;

  subscribeToUser: (
    uid: string,
    onChange: (user: UserProfile) => void,
    onError: (error: AppError) => void,
  ) => Unsubscribe;

  isLoginIdAvailable: (
    normalizedLoginId: string,
  ) => Promise<ServiceResult<boolean>>;

  createUserProfile: (
    input: CreateUserProfileInput,
  ) => Promise<ServiceResult<UserProfile>>;

  updateDisplayName: (
    uid: string,
    displayName: string,
  ) => Promise<EmptyServiceResult>;

  updateCurrentPack: (
    uid: string,
    packId: string | null,
  ) => Promise<EmptyServiceResult>;

updateLastLoginAt: (uid: string) => Promise<EmptyServiceResult>;
};

export type LoginIdValidationResult =
  | {
      success: true;
      normalizedLoginId: string;
    }
  | {
      success: false;
      message: string;
    };

export type PasswordValidationResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export type DisplayNameValidationResult =
  | {
      success: true;
      normalizedDisplayName: string;
    }
  | {
      success: false;
      message: string;
    };