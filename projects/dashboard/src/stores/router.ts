import { writable, derived } from 'svelte/store';
import Gallery from '../views/Gallery.svelte';
import Saved from '../views/Saved.svelte';
import Manage from '../views/Manage.svelte';
import Support from '../views/Support.svelte';
import New from '../views/New.svelte';

const createRouter = () => {
  const { subscribe, set } = writable(window.location.hash || '#/');

  const views: Record<string, any> = {
    '#/': Gallery,
    '#/new': New,
    '#/saved': Saved,
    '#/manage': Manage,
    '#/support': Support
  };

  return {
    subscribe,
    navigate: (path: string) => {
      window.location.hash = path;
      set(path);
    },
    get currentView() {
      return derived({ subscribe }, $path => views[$path] || Gallery);
    }
  };
};

export const router = createRouter();

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    router.navigate(window.location.hash);
  });
}
