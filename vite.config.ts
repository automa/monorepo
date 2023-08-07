/// <reference types="vitest" />

import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import { webpackStats } from 'rollup-plugin-webpack-stats';
import macros from 'vite-plugin-babel-macros';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import { ViteImageOptimizer as imageOptimizer } from 'vite-plugin-image-optimizer';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: 'build',
    sourcemap: !!process.env.BUILD_SOURCEMAP,
  },
  plugins: [
    imageOptimizer(),
    react(),
    svgr(),
    tsconfigPaths(),
    macros(),
    checker({
      typescript: true,
    }),
    eslint({
      exclude: ['/virtual:/**', '**/node_modules/**'],
    }),
    process.env.BUILD_STATS ? webpackStats() : undefined,
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
