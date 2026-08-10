import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';

import { firebaseApp } from './firebase';

export const firebaseAuth = getAuth(firebaseApp);

let persistenceInitialization: Promise<void> | null = null;

export function initializeAuthPersistence(): Promise<void> {
  if (!persistenceInitialization) {
    persistenceInitialization = setPersistence(
      firebaseAuth,
      browserLocalPersistence,
    );
  }

  return persistenceInitialization;
}