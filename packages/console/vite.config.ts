/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import { babelOptimizerPlugin } from '@graphql-codegen/client-preset';
import babel from '@rolldown/plugin-babel';
import react from '@vitejs/plugin-react';
import { webpackStats } from 'rollup-plugin-webpack-stats';
import { checker } from 'vite-plugin-checker';
import { ViteImageOptimizer as imageOptimizer } from 'vite-plugin-image-optimizer';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const vendors = ['react-dom', '@radix-ui', '@segment'];

export default defineConfig({
  define: {
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
  },
  build: {
    outDir: 'build',
    sourcemap: !!process.env.BUILD_SOURCEMAP,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: vendors.map((vendor) => ({
            test: new RegExp(`node_modules/${vendor}`),
            name: `vendor-${vendor.replace('@', '')}`,
          })),
        },
      },
    },
  },
  plugins: [
    imageOptimizer(),
    react(),
    babel({
      plugins: [
        [
          babelOptimizerPlugin,
          {
            artifactDirectory: './src/gql',
            gqlTagName: 'gql',
          },
        ],
      ],
    }),
    svgr(),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
    process.env.BUILD_STATS ? webpackStats() : undefined,
  ],
  server: {
    host: true,
    port: 3000,
    open: 'http://localhost:3000',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    passWithNoTests: true,
    dir: 'src',
    coverage: {
      reporter: ['lcov'],
      include: ['src'],
    },
  },
});
