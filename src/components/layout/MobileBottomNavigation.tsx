import { NavLink } from 'react-router-dom';

import { USER_NAVIGATION_ITEMS } from '@/constants';

export function MobileBottomNavigation() {
  return (
    <nav className="mobile-bottom-navigation" aria-label="하단 메뉴">
      {USER_NAVIGATION_ITEMS.map((item) => (
        <NavLink
          key={item.route}
          to={item.route}
          className={({ isActive }) =>
            isActive
              ? 'mobile-nav-item mobile-nav-item--active'
              : 'mobile-nav-item'
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}