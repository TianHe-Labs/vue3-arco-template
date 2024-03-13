/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESC: string;
  readonly VITE_APP_COPR: string;
  readonly VITE_DEV_PROXY: string[][];
}
