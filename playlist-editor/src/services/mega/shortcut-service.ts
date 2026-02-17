import { writable } from "svelte/store";

export interface Shortcut {
    id: string;
    key: string;
    description: string;
    action: () => void;
}

class ShortcutService {
    private shortcuts = writable<Shortcut[]>([]);
    public shortcutsStore = { subscribe: this.shortcuts.subscribe };

    init() {
        window.addEventListener('keydown', (e) => {
            let s: Shortcut[];
            this.shortcuts.subscribe(val => s = val)();

            const target = s.find(item => {
                const parts = item.key.toLowerCase().split('+');
                const key = parts.pop();
                const ctrl = parts.includes('ctrl') || parts.includes('meta');
                const shift = parts.includes('shift');
                const alt = parts.includes('alt');

                return e.key.toLowerCase() === key &&
                       e.ctrlKey === ctrl &&
                       e.shiftKey === shift &&
                       e.altKey === alt;
            });

            if (target) {
                e.preventDefault();
                target.action();
            }
        });
    }

    register(shortcut: Shortcut) {
        this.shortcuts.update(current => {
            const index = current.findIndex(s => s.id === shortcut.id);
            if (index !== -1) {
                current[index] = shortcut;
                return [...current];
            }
            return [...current, shortcut];
        });
    }
}

export const shortcutService = new ShortcutService();
