interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENCRYPTION_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}