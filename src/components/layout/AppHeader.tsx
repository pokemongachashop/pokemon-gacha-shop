import { Link, NavLink } from 'react-router-dom';

import { ROUTES, USER_ROLES } from '@/constants';
import { useAuth, useUser } from '@/hooks';
import { formatCoin } from '@/utils';

export function AppHeader() {
  const { logout, isAuthSubmitting, authError } = useAuth();
  const { displayName, coin, role } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="app-header">
      <Link to={ROUTES.HOME} className="app-header__brand">
        Pokemon Gacha Shop
      </Link>

      <div className="app-header__info">
        <span className="app-header__display-name">
          {displayName ?? '사용자'}
        </span>

        <span className="app-header__coin">{`${formatCoin(coin)} Coin`}</span>

        {role === USER_ROLES.ADMIN && (
          <NavLink
            to={ROUTES.ADMIN_DASHBOARD}
            className="app-header__admin-link"
          >
            관리자
          </NavLink>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isAuthSubmitting}
        >
          {isAuthSubmitting ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>

      {authError && (
        <p role="alert" className="app-header__error">
          {authError.userMessage}
        </p>
      )}
    </header>
  );
}