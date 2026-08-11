import { Timestamp } from 'firebase/firestore';

import { USER_ROLES } from '@/constants';
import type { UserRole } from '@/constants';
import type { ServiceResult, UserProfile } from '@/types';
import {
  createAppError,
  isNonEmptyString,
  isNonNegativeInteger,
  isWithinLength,
} from '@/utils';

function isUserRole(value: unknown): value is UserRole {
  return value === USER_ROLES.USER || value === USER_ROLES.ADMIN;
}

function isNullableId(value: unknown): value is string | null {
  return value === null || isNonEmptyString(value);
}

function isTimestampOrNull(value: unknown): value is Timestamp | null {
  return value === null || value instanceof Timestamp;
}

function isNullableKstString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

export function parseUserProfile(
  data: Record<string, unknown>,
  documentId: string,
): ServiceResult<UserProfile> {
  const invalidDocumentError = createAppError(
    'INTERNAL_ERROR',
    '계정 정보를 불러오는 중 문제가 발생했습니다.',
    { developerMessage: `Invalid user document: ${documentId}` },
  );

  const {
    uid,
    loginId,
    normalizedLoginId,
    displayName,
    role,
    coin,
    currentPackId,
    isActive,
    createdAt,
    createdAtKST,
    updatedAt,
    updatedAtKST,
    lastLoginAt,
    lastLoginAtKST,
  } = data;

  if (
    !isNonEmptyString(uid) ||
    uid !== documentId ||
    !isNonEmptyString(loginId) ||
    !isNonEmptyString(normalizedLoginId) ||
    !isNonEmptyString(displayName) ||
    !isWithinLength(displayName, 1, 32) ||
    !isUserRole(role) ||
    !isNonNegativeInteger(coin) ||
    !isNullableId(currentPackId) ||
    typeof isActive !== 'boolean' ||
    !isTimestampOrNull(createdAt) ||
    typeof createdAtKST !== 'string' ||
    !isTimestampOrNull(updatedAt) ||
    typeof updatedAtKST !== 'string' ||
    !isTimestampOrNull(lastLoginAt) ||
    !isNullableKstString(lastLoginAtKST)
  ) {
    return { success: false, error: invalidDocumentError };
  }

  return {
    success: true,
    data: {
      uid,
      loginId,
      normalizedLoginId,
      displayName,
      role,
      coin,
      currentPackId,
      isActive,
      createdAt,
      createdAtKST,
      updatedAt,
      updatedAtKST,
      lastLoginAt,
      lastLoginAtKST,
    },
  };
}