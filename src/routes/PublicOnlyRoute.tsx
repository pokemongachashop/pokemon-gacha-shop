import { Navigate, type PropsWithChildren } from 'react-router-dom';

import { AppInitializing } from '@/components/common';
import { ROUTES } from '@/constants';
import { useAuth, useUser } from '@/hooks';

export type PublicOnlyRouteProps = PropsWithChildren;

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isAuthInitializing } = useAuth();
  const { userProfile, isUserLoading } = useUser();

  if (isAuthInitializing) {
    return <AppInitializing />;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  if (isUserLoading) {
    return <AppInitializing />;
  }

  if (userProfile && userProfile.isActive) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <AppInitializing />;
}