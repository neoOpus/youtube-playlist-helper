import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
  // We don't force runes globally here to allow legacy dependencies (like lucide-svelte)
  // to compile without strict runes mode restrictions.
  // Individual files use <svelte:options runes={true} />
}
