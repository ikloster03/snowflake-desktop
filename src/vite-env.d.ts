/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Глобальные переменные, определенные в vite.config.ts
declare const __IS_TAURI__: boolean;
declare const __IS_WEB__: boolean;

// Дополнение для import.meta.env
interface ImportMetaEnv {
  readonly VITE_PLATFORM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
