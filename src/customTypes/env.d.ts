/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_BASE_URL: string;
  readonly VITE_BACKEND_BROKER_URL: string;
  readonly VITE_WEBSOCKET_FACTORY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
