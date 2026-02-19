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
    outDir: '../extension',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        'editor/index': path.resolve(__dirname, 'editor/index.html'),
        background: path.resolve(__dirname, '../extension/background.ts'),
        'popup/index': path.resolve(__dirname, 'popup/index.html'),
        'options/index': path.resolve(__dirname, 'options/index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'build/[name].js',
        assetFileNames: 'build/[name].[ext]',
      },
    },
  },
});
