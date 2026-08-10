import type { Unsubscribe } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { AUTH_ERROR_MESSAGES } from '@/constants/authErrors';
import { firebaseAuth, initializeAuthPersistence } from '@/firebase/auth';
import type {
  AppError,
  AuthServiceContract,
  AuthStateChangeHandler,
  AuthUserSummary,
  EmptyServiceResult,
  LoginInput,
  RegisterAuthInput,
  ServiceResult,
} from '@/types';
import {
  createAppError,
  createInternalEmail,
  mapFirebaseAuthError,
  validateLoginId,
  validatePassword,
} from '@/utils';

async function initializePersistence(): Promise<EmptyServiceResult> {
  try {
    await initializeAuthPersistence();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: createAppError(
        'AUTH_ERROR',
        AUTH_ERROR_MESSAGES.PERSISTENCE_FAILED,
        {
          developerMessage: '로그인 지속성(persistence) 설정 실패',
          cause: error,
        },
      ),
    };
  }
}

async function createAccount(
  input: RegisterAuthInput,
): Promise<ServiceResult<AuthUserSummary>> {
  const loginIdResult = validateLoginId(input.loginId);

  if (!loginIdResult.success) {
    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', loginIdResult.message),
    };
  }

  const passwordResult = validatePassword(
    input.password,
    loginIdResult.normalizedLoginId,
  );

  if (!passwordResult.success) {
    return {
      success: false,
      error: createAppError('VALIDATION_ERROR', passwordResult.message),
    };
  }

  const internalEmail = createInternalEmail(loginIdResult.normalizedLoginId);

  try {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      internalEmail,
      input.password,
    );

    return {
      success: true,
      data: { uid: credential.user.uid },
    };
  } catch (error) {
    return {
      success: false,
      error: mapFirebaseAuthError(error),
    };
  }
}

async function login(
  input: LoginInput,
): Promise<ServiceResult<AuthUserSummary>> {
  const loginIdResult = validateLoginId(input.loginId);

  if (!loginIdResult.success) {
    return {
      success: false,
      error: createAppError(
        'VALIDATION_ERROR',
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIAL,
      ),
    };
  }

  const persistenceResult = await initializePersistence();

  if (!persistenceResult.success) {
    return persistenceResult;
  }

  const internalEmail = createInternalEmail(loginIdResult.normalizedLoginId);

  try {
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      internalEmail,
      input.password,
    );

    return {
      success: true,
      data: { uid: credential.user.uid },
    };
  } catch (error) {
    return {
      success: false,
      error: mapFirebaseAuthError(error),
    };
  }
}

async function logout(): Promise<EmptyServiceResult> {
  try {
    await signOut(firebaseAuth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: mapFirebaseAuthError(error),
    };
  }
}

/**
 * 복구 전용 함수입니다.
 * Firebase Auth 계정 생성 직후 Firestore 초기 데이터 생성이 실패했을 때만 사용합니다.
 * 일반적인 회원 탈퇴 / 관리자 계정 삭제 기능으로 재사용하지 않습니다.
 */
async function deleteCurrentAccount(): Promise<EmptyServiceResult> {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    return {
      success: false,
      error: createAppError('NOT_FOUND', AUTH_ERROR_MESSAGES.UNKNOWN, {
        developerMessage: '삭제할 로그인 사용자가 없습니다.',
      }),
    };
  }

  try {
    await deleteUser(currentUser);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: mapFirebaseAuthError(error),
    };
  }
}

function getCurrentUser(): AuthUserSummary | null {
  const currentUser = firebaseAuth.currentUser;
  return currentUser ? { uid: currentUser.uid } : null;
}

function subscribeToAuthState(
  onChange: AuthStateChangeHandler,
  onError?: (error: AppError) => void,
): Unsubscribe {
  return onAuthStateChanged(
    firebaseAuth,
    (firebaseUser) => {
      onChange(firebaseUser ? { uid: firebaseUser.uid } : null);
    },
    (error) => {
      if (onError) {
        onError(mapFirebaseAuthError(error));
      }
    },
  );
}

export const AuthService: AuthServiceContract = {
  initializePersistence,
  createAccount,
  login,
  logout,
  deleteCurrentAccount,
  getCurrentUser,
  subscribeToAuthState,
};