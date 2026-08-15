import { SESSION_KEYS, STORAGE_KEYS } from '@/constants';
import type {
  AppError,
  AutomaticLogoutReason,
  SessionTerminationInfo,
  UserProfile,
} from '@/types';

import {
  getSessionStorageItem,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from './storage';

const VALID_REASONS: readonly AutomaticLogoutReason[] = [
  'ACCOUNT_DISABLED',
  'USER_DOCUMENT_MISSING',
  'USER_DATA_INVALID',
  'USER_ACCESS_DENIED',
  'SESSION_INVALID',
];

function isValidReason(value: unknown): value is AutomaticLogoutReason {
  return (
    typeof value === 'string' &&
    (VALID_REASONS as readonly string[]).includes(value)
  );
}

function isValidOccurredAt(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  return !Number.isNaN(new Date(value).getTime());
}

export function saveSessionTermination(
  info: SessionTerminationInfo,
): boolean {
  return setSessionStorageItem(
    SESSION_KEYS.SESSION_TERMINATION,
    JSON.stringify(info),
  );
}

export function getSessionTermination(): SessionTerminationInfo | null {
  const rawValue = getSessionStorageItem(SESSION_KEYS.SESSION_TERMINATION);

  if (rawValue === null) {
    return null;
  }

  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(rawValue);
  } catch {
    clearSessionTermination();
    return null;
  }

  if (typeof parsedValue !== 'object' || parsedValue === null) {
    clearSessionTermination();
    return null;
  }

  const candidate = parsedValue as Record<string, unknown>;

  if (
    !isValidReason(candidate.reason) ||
    !isValidOccurredAt(candidate.occurredAt)
  ) {
    clearSessionTermination();
    return null;
  }

  return {
    reason: candidate.reason,
    occurredAt: candidate.occurredAt,
  };
}

export function clearSessionTermination(): boolean {
  return removeSessionStorageItem(SESSION_KEYS.SESSION_TERMINATION);
}

/**
 * 로그아웃 시 계정에 종속된 임시 상태만 정리한다.
 * Theme, 공지 오늘 하루 보지 않기, 자동 로그아웃 사유는 건드리지 않는다.
 * 각 삭제가 개별적으로 실패하더라도 전체 로그아웃 흐름을 막지 않는다.
 */
export function clearUserSessionStorage(): void {
  removeLocalStorageItem(STORAGE_KEYS.CURRENT_PACK_ID);
  removeSessionStorageItem(SESSION_KEYS.PENDING_DRAW_REQUEST);
}

const ACCESS_DENIED_ERROR_CODES: readonly string[] = ['PERMISSION_DENIED'];
const FATAL_USER_DATA_ERROR_CODES: readonly string[] = [
  'INTERNAL_ERROR',
  'DATA_INTEGRITY_ERROR',
];

/**
 * 순수 함수. 인증/사용자 상태를 받아 지금 자동 로그아웃이 필요한지만 판정한다.
 * 우선순위: 비활성화 > 문서 누락 > 권한 거부 > 데이터 오류 > (그 외 null)
 */
export function getAutomaticLogoutReason(input: {
  isAuthenticated: boolean;
  isAuthInitializing: boolean;
  isUserLoading: boolean;
  userProfile: UserProfile | null;
  userError: AppError | null;
}): AutomaticLogoutReason | null {
  if (input.isAuthInitializing) {
    return null;
  }

  if (!input.isAuthenticated) {
    return null;
  }

  if (input.isUserLoading) {
    return null;
  }

  if (input.userProfile !== null && !input.userProfile.isActive) {
    return 'ACCOUNT_DISABLED';
  }

  if (input.userProfile === null && input.userError) {
    if (input.userError.code === 'NOT_FOUND') {
      return 'USER_DOCUMENT_MISSING';
    }

    if (ACCESS_DENIED_ERROR_CODES.includes(input.userError.code)) {
      return 'USER_ACCESS_DENIED';
    }

    if (FATAL_USER_DATA_ERROR_CODES.includes(input.userError.code)) {
      return 'USER_DATA_INVALID';
    }
  }

  return null;
}