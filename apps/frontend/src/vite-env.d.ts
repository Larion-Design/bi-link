/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_API: string
  readonly VITE_BACKEND_API_URL: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  readonly VITE_AUTH_BACKEND_API: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
