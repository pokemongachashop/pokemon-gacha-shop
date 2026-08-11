import { LOGIN_MESSAGES } from '@/constants';
import type {
  AppError,
  EmptyServiceResult,
  LoginInput,
  LoginResult,
  LoginServiceContract,
  ServiceResult,
} from '@/types';
import { createAppError, validateLoginInput } from '@/utils';

import { AuthService } from './AuthService';
import { UserService } from './UserService';

async function logoutAndFail(
  primaryError: AppError,
): Promise<ServiceResult<LoginResult>> {
  const logoutResult: EmptyServiceResult = await AuthService.logout();

  if (!logoutResult.success) {
    return {
      success: false,
      error: createAppError('AUTH_ERROR', LOGIN_MESSAGES.CLEANUP_FAILED, {
        developerMessage: `primaryError=${primaryError.code}; logoutError=${logoutResult.error.code}`,
      }),
    };
  }

  return { success: false, error: primaryError };
}

async function login(
  input: LoginInput,
): Promise<ServiceResult<LoginResult>> {
  // 1. 입력값 검증
  const validationResult = validateLoginInput(input);

  if (!validationResult.success) {
    return { success: false, error: validationResult.error };
  }

  const { normalizedLoginId, password } = validationResult.data;

  // 2. Firebase Authentication 로그인
  const authResult = await AuthService.login({
    loginId: normalizedLoginId,
    password,
  });

  if (!authResult.success) {
    return authResult;
  }

  const { uid } = authResult.data;

  // 3. Firestore 사용자 문서 조회
  const userResult = await UserService.getUser(uid);

  if (!userResult.success) {
    const primaryError =
      userResult.error.code === 'NOT_FOUND'
        ? createAppError('NOT_FOUND', LOGIN_MESSAGES.USER_DOCUMENT_MISSING, {
            developerMessage: `uid=${uid}; step=user-document-missing`,
          })
        : userResult.error;

    return logoutAndFail(primaryError);
  }

  const userProfile = userResult.data;

  // 4. 계정 활성 상태 확인
  if (!userProfile.isActive) {
    return logoutAndFail(
      createAppError('ACCOUNT_DISABLED', LOGIN_MESSAGES.ACCOUNT_DISABLED, {
        developerMessage: `uid=${uid}; step=account-disabled`,
      }),
    );
  }

  // 5. 정합성 검증 (Firestore 문서의 UID / Login ID가 인증 결과와 일치하는지 확인)
  if (
    userProfile.uid !== uid ||
    userProfile.normalizedLoginId !== normalizedLoginId
  ) {
    return logoutAndFail(
      createAppError(
        'DATA_INTEGRITY_ERROR',
        LOGIN_MESSAGES.DATA_INTEGRITY_ERROR,
        { developerMessage: `uid=${uid}; step=identity-mismatch` },
      ),
    );
  }

  // 6. 마지막 로그인 시간 갱신 (부가 정보이므로 실패해도 로그인 자체는 유지한다)
  const lastLoginResult = await UserService.updateLastLoginAt(uid);

  if (!lastLoginResult.success) {
    // SystemLogService가 생기면 여기서 경고 로그를 남긴다. 지금은 로그인만 계속 진행한다.
  }

  // 7. 성공 결과 반환 (UID만 반환, UserProfile 전체는 UserProvider가 이후 구독)
  return {
    success: true,
    data: { uid },
  };
}

export const LoginService: LoginServiceContract = {
  login,
};