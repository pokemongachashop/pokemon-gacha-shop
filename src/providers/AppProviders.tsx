import type { PropsWithChildren } from 'react';

import { AuthProvider } from './AuthProvider';
import { UserProvider } from './UserProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
}