import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
// import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
    root: './',
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  plugins: [
    // tsconfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});