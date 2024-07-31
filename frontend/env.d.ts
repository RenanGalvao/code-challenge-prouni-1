/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_APP_PORT: number
    readonly VITE_APP_ORIGIN: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}