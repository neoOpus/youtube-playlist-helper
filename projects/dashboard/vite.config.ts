import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  base: './',
  resolve: {
    alias: {
      '@yph/core': path.resolve(__dirname, '../core/index.ts'),
      '@yph/ui-kit': path.resolve(__dirname, '../ui-kit/index.ts'),
    },
  },
  build: {
    outDir: '../extension/editor',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'build/[name].js',
        chunkFileNames: 'build/[name].js',
        assetFileNames: 'build/[name].[ext]',
      },
    },
  },
  server: {
    port: 5000,
  },
});
