/// <reference types="vitest" />

import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import { webpackStats } from 'rollup-plugin-webpack-stats';
import macros from 'vite-plugin-babel-macros';
import checker from 'vite-plugin-checker';
import { ViteImageOptimizer as imageOptimizer } from 'vite-plugin-image-optimizer';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { babelOptimizerPlugin } from '@graphql-codegen/client-preset';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
  },
  build: {
    outDir: 'build',
    sourcemap: !!process.env.BUILD_SOURCEMAP,
  },
  plugins: [
    imageOptimizer(),
    react({
      babel: {
        plugins: [
          [
            babelOptimizerPlugin,
            {
              artifactDirectory: './src/gql',
              gqlTagName: 'gql',
            },
          ],
        ],
      },
    }),
    svgr(),
    tsconfigPaths(),
    macros(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint .',
        dev: {
          logLevel: ['error'],
        },
      },
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
