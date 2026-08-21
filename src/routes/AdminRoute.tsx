import {
  Navigate,
  useLocation,
  type PropsWithChildren,
} from 'react-router-dom';

import { AppInitializing } from '@/components/common';
import { ROUTES, USER_ROLES } from '@/constants';
import { useAuth, useSession, useUser } from '@/hooks';

export type AdminRouteProps = PropsWithChildren;

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAuthInitializing } = useAuth();
  const { userProfile, isUserLoading, role } = useUser();
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

  if (role !== USER_ROLES.ADMIN) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <>{children}</>;
}