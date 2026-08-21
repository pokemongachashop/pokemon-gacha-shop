import { NavLink } from 'react-router-dom';

import { USER_NAVIGATION_ITEMS } from '@/constants';

export function DesktopNavigation() {
  return (
    <nav className="desktop-navigation" aria-label="주요 메뉴">
      {USER_NAVIGATION_ITEMS.map((item) => (
        <NavLink
          key={item.route}
          to={item.route}
          className={({ isActive }) =>
            isActive
              ? 'navigation-item navigation-item--active'
              : 'navigation-item'
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}