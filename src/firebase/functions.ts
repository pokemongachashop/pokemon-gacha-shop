import { getFunctions } from 'firebase/functions';

import { ENVIRONMENT } from '@/constants/environment';

import { firebaseApp } from './firebase';

export const firebaseFunctions = getFunctions(
  firebaseApp,
  ENVIRONMENT.firebase.functionsRegion,
);