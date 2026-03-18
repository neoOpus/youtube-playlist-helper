import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'copy-scripts',
      closeBundle() {
        const srcDir = path.resolve(__dirname, '../extension/scripts');
        const destDir = path.resolve(__dirname, '../extension/editor/scripts');
        if (fs.existsSync(srcDir)) {
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          fs.readdirSync(srcDir).forEach(file => {
            fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
          });
        }
      }
    }
  ],
  base: './',
  resolve: {
    alias: {
      '@yph/core': path.resolve(__dirname, '../core/index.ts'),
      '@yph/ui-kit': path.resolve(__dirname, '../ui-kit/'),
    },
  },
  build: {
    outDir: '../extension/editor',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, '../extension/background.ts')
      },
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
