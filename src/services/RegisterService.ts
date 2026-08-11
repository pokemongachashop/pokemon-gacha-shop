import { REGISTER_MESSAGES } from '@/constants';
import type {
  InitialCoinProvider,
  RegisterInput,
  RegisterResult,
  RegisterServiceContract,
  RegistrationFailureReporter,
  ServiceResult,
} from '@/types';
import {
  createAppError,
  isNonNegativeInteger,
  validateRegisterInput,
} from '@/utils';

import { AuthService } from './AuthService';
import { UserService } from './UserService';

type RegisterServiceDependencies = {
  getInitialUserCoin: InitialCoinProvider['getInitialUserCoin'];
  reportRollbackFailure?: RegistrationFailureReporter['reportRollbackFailure'];
};

export function createRegisterService(
  dependencies: RegisterServiceDependencies,
): RegisterServiceContract {
  async function register(
    input: RegisterInput,
  ): Promise<ServiceResult<RegisterResult>> {
    // 1. 입력값 검증
    const validationResult = validateRegisterInput(input);

    if (!validationResult.success) {
      return { success: false, error: validationResult.error };
    }

    const { normalizedLoginId, normalizedDisplayName, password } =
      validationResult.data;

    // 2. Login ID 중복 사전 확인
    const availabilityResult =
      await UserService.isLoginIdAvailable(normalizedLoginId);

    if (!availabilityResult.success) {
      return availabilityResult;
    }

    if (!availabilityResult.data) {
      return {
        success: false,
        error: createAppError('CONFLICT', REGISTER_MESSAGES.LOGIN_ID_TAKEN),
      };
    }

    // 3. 초기 Coin 조회 (SiteService가 생기기 전까지는 주입된 Provider 사용)
    const initialCoinResult = await dependencies.getInitialUserCoin();

    if (
      !initialCoinResult.success ||
      !isNonNegativeInteger(initialCoinResult.data)
    ) {
      return {
        success: false,
        error: createAppError(
          'INTERNAL_ERROR',
          REGISTER_MESSAGES.INITIAL_COIN_UNAVAILABLE,
          { developerMessage: 'initialUserCoin unavailable or invalid' },
        ),
      };
    }

    const initialCoin = initialCoinResult.data;

    // 4. Firebase Authentication 계정 생성
    const authResult = await AuthService.createAccount({
      loginId: normalizedLoginId,
      password,
    });

    if (!authResult.success) {
      // 사전 확인을 통과했는데도 Auth 계정이 이미 있다면 데이터 불일치 상황이므로
      // 관리자 문의가 필요하다는 메시지로 구분해서 안내한다.
      if (authResult.error.code === 'CONFLICT') {
        return {
          success: false,
          error: createAppError(
            'CONFLICT',
            REGISTER_MESSAGES.LOGIN_ID_TAKEN_NEEDS_SUPPORT,
            {
              developerMessage: `Unexpected auth account collision after availability check passed. normalizedLoginId=${normalizedLoginId}`,
            },
          ),
        };
      }
      return authResult;
    }

    const { uid } = authResult.data;

    // 5. Firestore 사용자 문서 + Username Mapping 생성 (UserService 내부 Transaction)
    const profileResult = await UserService.createUserProfile({
      uid,
      loginId: normalizedLoginId,
      normalizedLoginId,
      displayName: normalizedDisplayName,
      initialCoin,
    });

    if (!profileResult.success) {
      // 6. Firestore 초기화 실패 → Auth 계정 삭제 복구 시도
      const rollbackResult = await AuthService.deleteCurrentAccount();

      if (!rollbackResult.success) {
        if (dependencies.reportRollbackFailure) {
          await dependencies.reportRollbackFailure({
            uid,
            normalizedLoginId,
            cause: rollbackResult.error,
          });
        }

        return {
          success: false,
          error: createAppError(
            'REGISTRATION_ROLLBACK_FAILED',
            REGISTER_MESSAGES.ROLLBACK_FAILED,
            {
              developerMessage: `uid=${uid}; step=firestore-init; authDeleteError=${rollbackResult.error.code}`,
            },
          ),
        };
      }

      // Rollback 성공. Firestore 실패 원인이 Username 경쟁 조건(CONFLICT)이었다면
      // 사용자에게는 일반적인 중복 메시지만 보여준다.
      if (profileResult.error.code === 'CONFLICT') {
        return {
          success: false,
          error: createAppError(
            'CONFLICT',
            REGISTER_MESSAGES.LOGIN_ID_TAKEN,
          ),
        };
      }

      return profileResult;
    }

    // 7. 성공 결과 반환 (내부 이메일 / 비밀번호 / Role / Coin 미포함)
    return {
      success: true,
      data: {
        uid,
        loginId: normalizedLoginId,
        displayName: normalizedDisplayName,
      },
    };
  }

  return { register };
}

/**
 * SiteService(운영자가 설정하는 초기 지급 코인)가 아직 없어서,
 * 지금은 항상 실패를 반환하는 임시 Provider로 구성했습니다.
 * SiteService.getInitialUserCoin()이 만들어지면 이 부분만 교체하면 됩니다.
 * 초기 코인 값을 코드에 직접 적지 않기 위한 의도적인 선택입니다.
 */
const unavailableInitialCoinProvider: InitialCoinProvider['getInitialUserCoin'] =
  async () => ({
    success: false,
    error: createAppError(
      'INTERNAL_ERROR',
      REGISTER_MESSAGES.INITIAL_COIN_UNAVAILABLE,
      {
        developerMessage:
          'SiteService is not implemented yet; register() is blocked until an initial coin provider is wired in.',
      },
    ),
  });

export const RegisterService: RegisterServiceContract = createRegisterService(
  { getInitialUserCoin: unavailableInitialCoinProvider },
);