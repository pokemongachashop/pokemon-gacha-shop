import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { AdminLayout, AuthLayout, UserLayout } from '@/layouts';
import { AdminPlaceholderPage } from '@/pages/admin';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { ForbiddenPage, NotFoundPage } from '@/pages/errors';
import {
  HomePlaceholderPage,
  InventoryPlaceholderPage,
  NoticesPlaceholderPage,
  ProfilePlaceholderPage,
} from '@/pages/user';

import { AdminRoute } from './AdminRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { RootRedirect } from './RootRedirect';

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<RootRedirect />} />

      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.HOME} element={<HomePlaceholderPage />} />
        <Route
          path={ROUTES.INVENTORY}
          element={<InventoryPlaceholderPage />}
        />
        <Route path={ROUTES.NOTICES} element={<NoticesPlaceholderPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePlaceholderPage />} />
      </Route>

      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route
          path={ROUTES.ADMIN_ROOT}
          element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />}
        />
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={<AdminPlaceholderPage />}
        />
        <Route path={ROUTES.ADMIN_USERS} element={<AdminPlaceholderPage />} />
        <Route
          path={ROUTES.ADMIN_CARD_PACKS}
          element={<AdminPlaceholderPage />}
        />
        <Route
          path={ROUTES.ADMIN_PRODUCTS}
          element={<AdminPlaceholderPage />}
        />
        <Route path={ROUTES.ADMIN_COIN} element={<AdminPlaceholderPage />} />
        <Route
          path={ROUTES.ADMIN_NOTICES}
          element={<AdminPlaceholderPage />}
        />
        <Route
          path={ROUTES.ADMIN_SETTINGS}
          element={<AdminPlaceholderPage />}
        />
        <Route
          path={ROUTES.ADMIN_STATISTICS}
          element={<AdminPlaceholderPage />}
        />
        <Route
          path={ROUTES.ADMIN_AUDIT_LOGS}
          element={<AdminPlaceholderPage />}
        />
        <Route
          path={ROUTES.ADMIN_SYSTEM_LOGS}
          element={<AdminPlaceholderPage />}
        />
        <Route
          path={ROUTES.ADMIN_BACKUPS}
          element={<AdminPlaceholderPage />}
        />
      </Route>

      <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}