import { writable } from 'svelte/store';
import { storage } from '../services/core/storage-service';

export const themeStore = writable('device');

export async function initTheme() {
    const val = await storage.get("themeChoice", "device");
    themeStore.set(val);
    themeStore.subscribe(v => {
        storage.set("themeChoice", v);
        applyTheme();
    });
    applyTheme();
}

function applyTheme() {
    themeStore.subscribe(v => {
        if (v === 'dark') document.body.classList.add('dark-theme');
        else if (v === 'light') document.body.classList.remove('dark-theme');
        else {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.toggle('dark-theme', isDark);
        }
    })();
}
