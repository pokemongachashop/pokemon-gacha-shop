import type { UserRole } from '@/constants';

export type User = {
  uid: string;
  loginId: string;
  displayName: string;
  role: UserRole;
  coin: number;
  isActive: boolean;
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