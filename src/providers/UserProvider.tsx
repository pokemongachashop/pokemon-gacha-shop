import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { USER_MESSAGES } from '@/constants';
import { UserContext } from '@/contexts';
import { useAuth } from '@/hooks';
import { UserService } from '@/services';
import type {
  AppError,
  EmptyServiceResult,
  UserContextValue,
  UserProfile,
  UserRole,
} from '@/types';
import { createAppError } from '@/utils';

export type UserProviderProps = PropsWithChildren;

export function UserProvider({ children }: UserProviderProps) {
  const { authUser, isAuthInitializing } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState<AppError | null>(null);

  const resetUserState = useCallback(() => {
    setUserProfile(null);
    setUserError(null);
    setIsUserLoading(false);
  }, []);

  useEffect(() => {
    // 인증 초기화가 끝나기 전에는 어떤 UID를 구독할지 아직 알 수 없다.
    if (isAuthInitializing) {
      return;
    }

    const uid = authUser?.uid ?? null;

    if (!uid) {
      resetUserState();
      return;
    }

    setIsUserLoading(true);
    setUserError(null);

    const unsubscribe = UserService.subscribeToUser(
      uid,
      (user) => {
        // 이전 UID Listener의 늦은 Snapshot이 새 사용자 상태를 덮어쓰지 않도록
        // 막는 동시에, 문서 UID가 인증 UID와 일치하는지도 함께 확인한다.
        if (user.uid !== uid) {
          return;
        }

        setUserProfile(user);
        setUserError(null);
        setIsUserLoading(false);
      },
      (error) => {
        setUserError(error);
        setIsUserLoading(false);

        // 권한 오류/문서 오류 등 신뢰할 수 없는 상태는 Profile을 비운다.
        // 일시적 네트워크 오류만 마지막 정상 Profile을 유지한다.
        if (error.code !== 'NETWORK_ERROR') {
          setUserProfile(null);
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [authUser?.uid, isAuthInitializing, resetUserState]);

  const clearUserError = useCallback(() => {
    setUserError(null);
  }, []);

  const refreshUser = useCallback(async (): Promise<EmptyServiceResult> => {
    if (!authUser) {
      return {
        success: false,
        error: createAppError('AUTH_ERROR', USER_MESSAGES.NOT_FOUND, {
          developerMessage: 'refreshUser called while not authenticated',
        }),
      };
    }

    const result = await UserService.getUser(authUser.uid);

    if (!result.success) {
      setUserError(result.error);
      return { success: false, error: result.error };
    }

    setUserProfile(result.data);
    setUserError(null);
    return { success: true };
  }, [authUser]);

  const coin = userProfile?.coin ?? 0;
  const role: UserRole | null = userProfile?.role ?? null;
  const displayName = userProfile?.displayName ?? null;
  const currentPackId = userProfile?.currentPackId ?? null;
  const isActive = userProfile?.isActive ?? false;

  const value = useMemo<UserContextValue>(
    () => ({
      userProfile,
      coin,
      role,
      displayName,
      currentPackId,
      isActive,
      isUserLoading,
      userError,
      clearUserError,
      refreshUser,
    }),
    [
      userProfile,
      coin,
      role,
      displayName,
      currentPackId,
      isActive,
      isUserLoading,
      userError,
      clearUserError,
      refreshUser,
    ],
  );

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}