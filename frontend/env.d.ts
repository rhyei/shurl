interface ImportMetaEnv {
  readonly VITE_GOOGLE_RECAPTCHA_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'bun' {
  interface Env {
    BACKEND_URL: string
  }
}
