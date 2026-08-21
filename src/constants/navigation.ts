import { ROUTES } from './routes';

export const USER_NAVIGATION_ITEMS = [
  { label: '홈', route: ROUTES.HOME },
  { label: '보관함', route: ROUTES.INVENTORY },
  { label: '공지', route: ROUTES.NOTICES },
  { label: '프로필', route: ROUTES.PROFILE },
] as const;

export type NavigationItem = (typeof USER_NAVIGATION_ITEMS)[number];