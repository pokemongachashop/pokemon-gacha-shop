import { useContext } from 'react';

import { SessionContext } from '@/contexts';
import type { SessionContextValue } from '@/types';

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error(
      'useSession must be used within SessionLifecycleProvider.',
    );
  }

  return context;
}