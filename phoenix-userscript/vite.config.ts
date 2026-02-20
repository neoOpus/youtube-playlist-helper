import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    svelte(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Phoenix SOTA Form Recovery',
        namespace: 'https://github.com/user/phoenix-recovery',
        version: '2026.02.15.01',
        author: 'Anoir Ben Tanfous aka neoOpus',
        description: 'Experimental State-of-the-Art Form Recovery Userscript',
        match: ['*://*/*'],
        grant: ['GM_addStyle', 'GM_getValue', 'GM_setValue'],
        'run-at': 'document-start'
      },
    }),
  ],
});
