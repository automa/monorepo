/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_URI: string;
  readonly VITE_GRAPHQL_URI: string;
  readonly VITE_SEGMENT_KEY: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_STATSIG_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
