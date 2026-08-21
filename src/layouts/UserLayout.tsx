import { Outlet } from 'react-router-dom';

import {
  AppHeader,
  DesktopNavigation,
  MobileBottomNavigation,
  PageContainer,
} from '@/components/layout';

export function UserLayout() {
  return (
    <div className="user-layout">
      <AppHeader />

      <div className="user-layout__body">
        <DesktopNavigation />

        <main className="user-layout__main">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </div>

      <MobileBottomNavigation />
    </div>
  );
}