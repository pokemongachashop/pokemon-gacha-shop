import type { PropsWithChildren } from 'react';

import { AuthProvider } from './AuthProvider';
import { SessionLifecycleProvider } from './SessionLifecycleProvider';
import { UserProvider } from './UserProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <UserProvider>
        <SessionLifecycleProvider>{children}</SessionLifecycleProvider>
      </UserProvider>
    </AuthProvider>
  );
}