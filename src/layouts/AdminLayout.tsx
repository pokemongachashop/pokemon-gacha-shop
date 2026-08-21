import { Link, NavLink, Outlet } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { useAuth, useUser } from '@/hooks';

const ADMIN_NAVIGATION_ITEMS = [
  { label: 'Dashboard', route: ROUTES.ADMIN_DASHBOARD },
  { label: 'Users', route: ROUTES.ADMIN_USERS },
  { label: 'Card Packs', route: ROUTES.ADMIN_CARD_PACKS },
  { label: 'Products', route: ROUTES.ADMIN_PRODUCTS },
  { label: 'Coin', route: ROUTES.ADMIN_COIN },
  { label: 'Notices', route: ROUTES.ADMIN_NOTICES },
  { label: 'Settings', route: ROUTES.ADMIN_SETTINGS },
] as const;

export function AdminLayout() {
  const { logout, isAuthSubmitting } = useAuth();
  const { displayName } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="admin-layout">
      <header className="admin-layout__header">
        <span className="admin-layout__title">관리자 CMS</span>

        <span className="admin-layout__display-name">
          {displayName ?? '관리자'}
        </span>

        <Link to={ROUTES.HOME}>사용자 화면</Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isAuthSubmitting}
        >
          {isAuthSubmitting ? '로그아웃 중...' : '로그아웃'}
        </button>
      </header>

      <nav className="admin-layout__nav" aria-label="관리자 메뉴">
        {ADMIN_NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.route}
            to={item.route}
            className={({ isActive }) =>
              isActive
                ? 'admin-nav-item admin-nav-item--active'
                : 'admin-nav-item'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
}