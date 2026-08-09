import type { UserRole } from '@/constants';

export type User = {
  uid: string;
  loginId: string;
  displayName: string;
  role: UserRole;
  coin: number;
  isActive: boolean;
};