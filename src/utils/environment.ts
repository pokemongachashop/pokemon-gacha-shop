import { ENVIRONMENT } from '@/constants/environment';

export type EnvironmentValidationResult =
  | {
      success: true;
    }
  | {
      success: false;
      missingKeys: string[];
    };

const REQUIRED_ENVIRONMENT_KEYS: Array<{
  key: string;
  value: string | undefined;
}> = [
  { key: 'VITE_FIREBASE_API_KEY', value: ENVIRONMENT.firebase.apiKey },
  {
    key: 'VITE_FIREBASE_AUTH_DOMAIN',
    value: ENVIRONMENT.firebase.authDomain,
  },
  { key: 'VITE_FIREBASE_PROJECT_ID', value: ENVIRONMENT.firebase.projectId },
  {
    key: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
    value: ENVIRONMENT.firebase.messagingSenderId,
  },
  { key: 'VITE_FIREBASE_APP_ID', value: ENVIRONMENT.firebase.appId },
  {
    key: 'VITE_FIREBASE_FUNCTIONS_REGION',
    value: ENVIRONMENT.firebase.functionsRegion,
  },
  { key: 'VITE_BASE_PATH', value: ENVIRONMENT.basePath },
];

const PLACEHOLDER_PATTERN = /^(YOUR_|__|<.*>)/i;

function isMissingValue(value: string | undefined): boolean {
  if (value === undefined) {
    return true;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return true;
  }

  return PLACEHOLDER_PATTERN.test(trimmedValue);
}

export function validateEnvironment(): EnvironmentValidationResult {
  const missingKeys = REQUIRED_ENVIRONMENT_KEYS.filter((entry) =>
    isMissingValue(entry.value),
  ).map((entry) => entry.key);

  if (missingKeys.length > 0) {
    return {
      success: false,
      missingKeys,
    };
  }

  return { success: true };
}