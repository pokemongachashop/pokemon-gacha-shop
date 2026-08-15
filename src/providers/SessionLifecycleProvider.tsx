import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { SessionContext } from '@/contexts';
import { useAuth, useUser } from '@/hooks';
import type {
  AppError,
  SessionContextValue,
  SessionTerminationInfo,
} from '@/types';
import {
  clearSessionTermination,
  clearUserSessionStorage,
  getAutomaticLogoutReason,
  getSessionTermination,
  saveSessionTermination,
} from '@/utils';

export type SessionLifecycleProviderProps = PropsWithChildren;

export function SessionLifecycleProvider({
  children,
}: SessionLifecycleProviderProps) {
  const { authUser, isAuthenticated, isAuthInitializing, logout } = useAuth();
  const { userProfile, isUserLoading, userError } = useUser();

  const [terminationInfo, setTerminationInfo] =
    useState<SessionTerminationInfo | null>(() => getSessionTermination());
  const [isTerminatingSession, setIsTerminatingSession] = useState(false);
  const [terminationError, setTerminationError] = useState<AppError | null>(
    null,
  );

  const automaticLogoutInProgressRef = useRef(false);

  useEffect(() => {
    // 실제로 로그아웃(비인증 전환)이 확인된 뒤에만 Lock을 다시 연다.
    // logout() 호출 성공만으로 미리 풀지 않는다 (Auth Listener 반영 전 재실행 방지).
    if (!authUser) {
      automaticLogoutInProgressRef.current = false;
    }
  }, [authUser]);

  useEffect(() => {
    if (automaticLogoutInProgressRef.current) {
      return;
    }

    const reason = getAutomaticLogoutReason({
      isAuthenticated,
      isAuthInitializing,
      isUserLoading,
      userProfile,
      userError,
    });

    if (!reason) {
      return;
    }

    automaticLogoutInProgressRef.current = true;

    const terminate = async () => {
      setIsTerminatingSession(true);
      setTerminationError(null);

      const info: SessionTerminationInfo = {
        reason,
        occurredAt: new Date().toISOString(),
      };

      // logout() 호출 전에 사유부터 저장한다 (도중 오류가 나도 원인이 남도록).
      saveSessionTermination(info);
      setTerminationInfo(info);

      clearUserSessionStorage();

      const result = await logout();

      if (!result.success) {
        // 실패 시 Lock은 유지한다. 자동 재시도는 하지 않고,
        // authUser가 실제로 null이 될 때까지 기다린다.
        setTerminationError(result.error);
      }

      setIsTerminatingSession(false);
    };

    void terminate();
  }, [
    isAuthenticated,
    isAuthInitializing,
    isUserLoading,
    userProfile,
    userError,
    logout,
  ]);

  const clearTerminationInfo = useCallback(() => {
    clearSessionTermination();
    setTerminationInfo(null);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      terminationInfo,
      isTerminatingSession,
      terminationError,
      clearTerminationInfo,
    }),
    [
      terminationInfo,
      isTerminatingSession,
      terminationError,
      clearTerminationInfo,
    ],
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}