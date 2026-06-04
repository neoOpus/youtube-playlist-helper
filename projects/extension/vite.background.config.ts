import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@yph/core': path.resolve(__dirname, '../core/index.ts'),
    },
  },
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'background.ts'),
      name: 'YPHBackground',
      formats: ['iife'],
      fileName: () => 'background.js',
    },
  },
});
