import { useContext } from 'react';

import { UserContext } from '@/contexts';
import type { UserContextValue } from '@/types';

export function useUser(): UserContextValue {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within UserProvider.');
  }

  return context;
}