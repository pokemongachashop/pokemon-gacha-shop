import type { FirebaseOptions } from 'firebase/app';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { ENVIRONMENT } from '@/constants/environment';
import { createAppError } from '@/utils/error';
import { validateEnvironment } from '@/utils/environment';

const environmentValidationResult = validateEnvironment();

if (!environmentValidationResult.success) {
  throw createAppError(
    'ENVIRONMENT_ERROR',
    '서비스 설정을 불러오지 못했습니다. 관리자에게 문의해주세요.',
    {
      developerMessage: `Missing environment keys: ${environmentValidationResult.missingKeys.join(', ')}`,
    },
  );
}

const firebaseConfig: FirebaseOptions = {
  apiKey: ENVIRONMENT.firebase.apiKey,
  authDomain: ENVIRONMENT.firebase.authDomain,
  projectId: ENVIRONMENT.firebase.projectId,
  messagingSenderId: ENVIRONMENT.firebase.messagingSenderId,
  appId: ENVIRONMENT.firebase.appId,
};

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);