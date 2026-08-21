import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/constants';
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

      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute>
            <HomePlaceholderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.INVENTORY}
        element={
          <ProtectedRoute>
            <InventoryPlaceholderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.NOTICES}
        element={
          <ProtectedRoute>
            <NoticesPlaceholderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <ProfilePlaceholderPage />
          </ProtectedRoute>
        }
      />

      {/* /admin 자체는 권한 확인 후 /admin/dashboard로 다시 이동한다. */}
      <Route
        path={ROUTES.ADMIN_ROOT}
        element={
          <AdminRoute>
            <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_USERS}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_CARD_PACKS}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_PRODUCTS}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_COIN}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_NOTICES}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_SETTINGS}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_STATISTICS}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_AUDIT_LOGS}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_SYSTEM_LOGS}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_BACKUPS}
        element={
          <AdminRoute>
            <AdminPlaceholderPage />
          </AdminRoute>
        }
      />

      <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}