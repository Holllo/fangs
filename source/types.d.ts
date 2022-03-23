import {html} from 'htm/preact';

declare global {
  // See Vite documentation for `import.meta.env` usage.
  // https://vitejs.dev/guide/env-and-mode.html

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly BASE_URL: string;
    readonly DEV: boolean;
    readonly MODE: string;
    readonly PROD: boolean;
    readonly VITE_BROWSER: 'chromium' | 'firefox';
  }

  type HtmComponent = ReturnType<typeof html>;
}
