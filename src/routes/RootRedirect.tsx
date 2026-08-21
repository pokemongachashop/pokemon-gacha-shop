import { Navigate } from 'react-router-dom';

import { AppInitializing } from '@/components/common';
import { ROUTES } from '@/constants';
import { useAuth, useUser } from '@/hooks';

export function RootRedirect() {
  const { isAuthenticated, isAuthInitializing } = useAuth();
  const { userProfile, isUserLoading } = useUser();

  if (isAuthInitializing) {
    return <AppInitializing />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isUserLoading) {
    return <AppInitializing />;
  }

  if (userProfile && userProfile.isActive) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <AppInitializing />;
}