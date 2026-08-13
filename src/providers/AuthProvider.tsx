import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { AUTH_SESSION_MESSAGES } from '@/constants';
import { AuthContext } from '@/contexts';
import { AuthService, LoginService, RegisterService } from '@/services';
import type {
  AppError,
  AuthContextValue,
  AuthUserSummary,
  EmptyServiceResult,
  LoginInput,
  LoginResult,
  RegisterInput,
  RegisterResult,
  ServiceResult,
} from '@/types';
import { createAppError } from '@/utils';

export type AuthProviderProps = PropsWithChildren;

export function AuthProvider({ children }: AuthProviderProps) {
  const [authUser, setAuthUser] = useState<AuthUserSummary | null>(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<AppError | null>(null);

  // isAuthSubmitting(State)는 리렌더링 이후에만 최신값을 보장하므로,
  // 연속 클릭 방지처럼 "지금 이 순간" 값이 필요한 판단은 Ref로 동기 확인한다.
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const initialize = async () => {
      const persistenceResult = await AuthService.initializePersistence();

      if (!isMounted) {
        return;
      }

      if (!persistenceResult.success) {
        setAuthError(
          createAppError(
            'AUTH_ERROR',
            AUTH_SESSION_MESSAGES.PERSISTENCE_INIT_FAILED,
            { developerMessage: persistenceResult.error.developerMessage },
          ),
        );
        setIsAuthInitializing(false);
        return;
      }

      unsubscribe = AuthService.subscribeToAuthState(
        (user) => {
          if (!isMounted) {
            return;
          }
          setAuthUser(user);
          setIsAuthInitializing(false);
        },
        (error) => {
          if (!isMounted) {
            return;
          }
          setAuthError(error);
          setIsAuthInitializing(false);
        },
      );
    };

    void initialize();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const login = useCallback(
    async (input: LoginInput): Promise<ServiceResult<LoginResult>> => {
      if (isSubmittingRef.current) {
        return {
          success: false,
          error: createAppError(
            'CONFLICT',
            AUTH_SESSION_MESSAGES.REQUEST_IN_PROGRESS,
          ),
        };
      }

      isSubmittingRef.current = true;
      setIsAuthSubmitting(true);
      setAuthError(null);

      try {
        const result = await LoginService.login(input);

        if (!result.success) {
          setAuthError(result.error);
        }

        // 로그인 성공 시 authUser는 여기서 직접 설정하지 않는다.
        // Firebase Auth Listener가 곧 동일 UID를 전달해 상태를 갱신한다.
        return result;
      } finally {
        isSubmittingRef.current = false;
        setIsAuthSubmitting(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (
      input: RegisterInput,
    ): Promise<ServiceResult<RegisterResult>> => {
      if (isSubmittingRef.current) {
        return {
          success: false,
          error: createAppError(
            'CONFLICT',
            AUTH_SESSION_MESSAGES.REQUEST_IN_PROGRESS,
          ),
        };
      }

      isSubmittingRef.current = true;
      setIsAuthSubmitting(true);
      setAuthError(null);

      try {
        const result = await RegisterService.register(input);

        if (!result.success) {
          setAuthError(result.error);
        }

        // 회원가입 성공 시 Firebase Auth가 이미 로그인 상태이므로
        // 별도 로그인 호출 없이 Listener가 상태를 갱신하도록 둔다.
        return result;
      } finally {
        isSubmittingRef.current = false;
        setIsAuthSubmitting(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<EmptyServiceResult> => {
    if (isSubmittingRef.current) {
      return {
        success: false,
        error: createAppError(
          'CONFLICT',
          AUTH_SESSION_MESSAGES.REQUEST_IN_PROGRESS,
        ),
      };
    }

    isSubmittingRef.current = true;
    setIsAuthSubmitting(true);
    setAuthError(null);

    try {
      const result = await AuthService.logout();

      if (!result.success) {
        // 로그아웃이 실제로 성공하기 전에는 authUser를 강제로 비우지 않는다.
        setAuthError(result.error);
      }

      return result;
    } finally {
      isSubmittingRef.current = false;
      setIsAuthSubmitting(false);
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      authUser,
      isAuthenticated: authUser !== null,
      isAuthInitializing,
      isAuthSubmitting,
      authError,
      login,
      register,
      logout,
      clearAuthError,
    }),
    [
      authUser,
      isAuthInitializing,
      isAuthSubmitting,
      authError,
      login,
      register,
      logout,
      clearAuthError,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}