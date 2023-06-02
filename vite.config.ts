/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import macros from 'vite-plugin-babel-macros';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: 'build',
    sourcemap: !!process.env.BUILD_SOURCEMAP,
  },
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
    macros(),
    checker({
      typescript: true,
    }),
    eslint({
      exclude: ['/virtual:/**', 'node_modules/**'],
    }),
  ],
  server: {
    port: 3000,
    open: 'http://localhost:3000',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['lcov'],
    },
  },
});
