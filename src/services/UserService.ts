import {
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { USER_MESSAGES, USER_ROLES, VALIDATION_MESSAGES } from '@/constants';
import { firestore } from '@/firebase/firestore';
import type {
  AppError,
  CreateUserProfileInput,
  EmptyServiceResult,
  ServiceResult,
  Unsubscribe,
  UserProfile,
  UserServiceContract,
} from '@/types';
import {
  createAppError,
  formatDateToKST,
  isAppError,
  isNonEmptyString,
  isNonNegativeInteger,
  mapFirestoreError,
  normalizeLoginId,
  validateDisplayName,
} from '@/utils';

import {
  getUserDocumentReference,
  getUsernameDocumentReference,
} from './FirestoreService';
import { parseUserProfile } from './parsers/userParser';

async function getUser(uid: string): Promise<ServiceResult<UserProfile>> {
  if (!isNonEmptyString(uid)) {
    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', USER_MESSAGES.NOT_FOUND),
    };
  }

  try {
    const snapshot = await getDoc(getUserDocumentReference(uid));

    if (!snapshot.exists()) {
      return {
        success: false,
        error: createAppError('NOT_FOUND', USER_MESSAGES.NOT_FOUND, {
          developerMessage: `User document missing: ${uid}`,
        }),
      };
    }

    return parseUserProfile(snapshot.data() ?? {}, snapshot.id);
  } catch (error) {
    return { success: false, error: mapFirestoreError(error) };
  }
}

function subscribeToUser(
  uid: string,
  onChange: (user: UserProfile) => void,
  onError: (error: AppError) => void,
): Unsubscribe {
  return onSnapshot(
    getUserDocumentReference(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onError(
          createAppError('NOT_FOUND', USER_MESSAGES.NOT_FOUND, {
            developerMessage: `User document missing during subscription: ${uid}`,
          }),
        );
        return;
      }

      const result = parseUserProfile(snapshot.data() ?? {}, snapshot.id);

      if (!result.success) {
        onError(result.error);
        return;
      }

      onChange(result.data);
    },
    (error) => {
      onError(mapFirestoreError(error));
    },
  );
}

async function isLoginIdAvailable(
  normalizedLoginId: string,
): Promise<ServiceResult<boolean>> {
  if (normalizeLoginId(normalizedLoginId) !== normalizedLoginId) {
    return {
      success: false,
      error: createAppError(
        'VALIDATION_ERROR',
        VALIDATION_MESSAGES.LOGIN_ID_INVALID,
      ),
    };
  }

  try {
    const snapshot = await getDoc(
      getUsernameDocumentReference(normalizedLoginId),
    );

    return { success: true, data: !snapshot.exists() };
  } catch (error) {
    return { success: false, error: mapFirestoreError(error) };
  }
}

async function createUserProfile(
  input: CreateUserProfileInput,
): Promise<ServiceResult<UserProfile>> {
  if (!isNonEmptyString(input.uid)) {
    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', USER_MESSAGES.NOT_FOUND, {
        developerMessage: 'createUserProfile called with empty uid',
      }),
    };
  }

  if (
    normalizeLoginId(input.normalizedLoginId) !== input.normalizedLoginId ||
    input.loginId !== input.normalizedLoginId
  ) {
    return {
      success: false,
      error: createAppError(
        'VALIDATION_ERROR',
        VALIDATION_MESSAGES.LOGIN_ID_INVALID,
      ),
    };
  }

  const displayNameResult = validateDisplayName(input.displayName);

  if (!displayNameResult.success) {
    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', displayNameResult.message),
    };
  }

  if (!isNonNegativeInteger(input.initialCoin)) {
    return {
      success: false,
      error: createAppError(
        'VALIDATION_ERROR',
        '초기 코인 값이 올바르지 않습니다.',
        { developerMessage: 'initialCoin must be a non-negative integer' },
      ),
    };
  }

  const userReference = getUserDocumentReference(input.uid);
  const usernameReference = getUsernameDocumentReference(
    input.normalizedLoginId,
  );

  try {
    await runTransaction(firestore, async (transaction) => {
      const [usernameSnapshot, userSnapshot] = await Promise.all([
        transaction.get(usernameReference),
        transaction.get(userReference),
      ]);

      if (usernameSnapshot.exists()) {
        throw createAppError(
          'CONFLICT',
          USER_MESSAGES.LOGIN_ID_ALREADY_IN_USE,
        );
      }

      if (userSnapshot.exists()) {
        throw createAppError(
          'CONFLICT',
          USER_MESSAGES.ACCOUNT_ALREADY_EXISTS,
        );
      }

      const nowKST = formatDateToKST(new Date());

      transaction.set(userReference, {
        uid: input.uid,
        loginId: input.normalizedLoginId,
        normalizedLoginId: input.normalizedLoginId,
        displayName: displayNameResult.normalizedDisplayName,
        role: USER_ROLES.USER,
        coin: input.initialCoin,
        currentPackId: null,
        isActive: true,
        createdAt: serverTimestamp(),
        createdAtKST: nowKST,
        updatedAt: serverTimestamp(),
        updatedAtKST: nowKST,
        lastLoginAt: null,
        lastLoginAtKST: null,
      });

      transaction.set(usernameReference, {
        uid: input.uid,
        loginId: input.normalizedLoginId,
        normalizedLoginId: input.normalizedLoginId,
        createdAt: serverTimestamp(),
        createdAtKST: nowKST,
      });
    });
  } catch (error) {
    if (isAppError(error)) {
      return { success: false, error };
    }
    return { success: false, error: mapFirestoreError(error) };
  }

  return getUser(input.uid);
}

async function updateDisplayName(
  uid: string,
  displayName: string,
): Promise<EmptyServiceResult> {
  if (!isNonEmptyString(uid)) {
    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', USER_MESSAGES.NOT_FOUND),
    };
  }

  const displayNameResult = validateDisplayName(displayName);

  if (!displayNameResult.success) {
    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', displayNameResult.message),
    };
  }

  try {
    const userReference = getUserDocumentReference(uid);
    const snapshot = await getDoc(userReference);

    if (!snapshot.exists()) {
      return {
        success: false,
        error: createAppError('NOT_FOUND', USER_MESSAGES.NOT_FOUND),
      };
    }

    await updateDoc(userReference, {
      displayName: displayNameResult.normalizedDisplayName,
      updatedAt: serverTimestamp(),
      updatedAtKST: formatDateToKST(new Date()),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: mapFirestoreError(error) };
  }
}

/**
 * 현재는 카드팩 존재 여부/ACTIVE 상태를 검증하지 않고 형식만 확인합니다.
 * CardPackService가 만들어지면 실제 카드팩 검증을 추가할 예정입니다.
 */
async function updateCurrentPack(
  uid: string,
  packId: string | null,
): Promise<EmptyServiceResult> {
  if (!isNonEmptyString(uid)) {
    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', USER_MESSAGES.NOT_FOUND),
    };
  }

  if (packId !== null && !isNonEmptyString(packId)) {
    return {
      success: false,
      error: createAppError(
        'VALIDATION_ERROR',
        '선택한 카드팩 정보가 올바르지 않습니다.',
      ),
    };
  }

  try {
    const userReference = getUserDocumentReference(uid);
    const snapshot = await getDoc(userReference);

    if (!snapshot.exists()) {
      return {
        success: false,
        error: createAppError('NOT_FOUND', USER_MESSAGES.NOT_FOUND),
      };
    }

    await updateDoc(userReference, {
      currentPackId: packId,
      updatedAt: serverTimestamp(),
      updatedAtKST: formatDateToKST(new Date()),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: mapFirestoreError(error) };
  }
}

/**
 * lastLoginAtKST는 서버 시간이 아닌 클라이언트 기기 시간 기반 추정값입니다.
 * 다른 *AtKST 필드들과 동일한 정책(클라이언트 최선 추정)을 유지합니다.
 * 실패하더라도 로그인 자체를 막지 않는 부가 정보이므로, 호출부(LoginService)는
 * 이 함수의 실패를 로그인 실패로 간주하지 않습니다.
 */
async function updateLastLoginAt(uid: string): Promise<EmptyServiceResult> {
  if (!isNonEmptyString(uid)) {
    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', USER_MESSAGES.NOT_FOUND),
    };
  }

  try {
    const userReference = getUserDocumentReference(uid);
    const snapshot = await getDoc(userReference);

    if (!snapshot.exists()) {
      return {
        success: false,
        error: createAppError('NOT_FOUND', USER_MESSAGES.NOT_FOUND),
      };
    }

    const nowKST = formatDateToKST(new Date());

    await updateDoc(userReference, {
      lastLoginAt: serverTimestamp(),
      lastLoginAtKST: nowKST,
      updatedAt: serverTimestamp(),
      updatedAtKST: nowKST,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: mapFirestoreError(error) };
  }
}

export const UserService: UserServiceContract = {
  getUser,
  subscribeToUser,
  isLoginIdAvailable,
  createUserProfile,
  updateDisplayName,
  updateCurrentPack,
  updateLastLoginAt,
};