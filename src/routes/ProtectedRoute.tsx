import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AppInitializing } from '@/components/common';
import { ROUTES } from '@/constants';
import { useAuth, useSession, useUser } from '@/hooks';

export type ProtectedRouteProps = PropsWithChildren;

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isAuthInitializing } = useAuth();
  const { userProfile, isUserLoading } = useUser();
  const { isTerminatingSession } = useSession();
  const location = useLocation();

  if (isAuthInitializing) {
    return <AppInitializing />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (isTerminatingSession) {
    return <AppInitializing />;
  }

  if (isUserLoading) {
    return <AppInitializing />;
  }

  if (!userProfile || !userProfile.isActive) {
    return <AppInitializing />;
  }

  return <>{children}</>;
}