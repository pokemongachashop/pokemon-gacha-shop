export const ENVIRONMENT = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    functionsRegion: import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION,
  },

  basePath: import.meta.env.VITE_BASE_PATH,

  useFirebaseEmulators:
    import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true',
} as const;