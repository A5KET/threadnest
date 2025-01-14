/// <reference types="vite/client" />

export interface ImportMetaEnv {
    VITE_BACKEND_URL: string
    VITE_STATIC_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}