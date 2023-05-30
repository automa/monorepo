/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import macros from 'vite-plugin-babel-macros';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

export default defineConfig({
  build: {
    outDir: 'build',
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
    open: true,
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
