import { writable } from 'svelte/store';
import { storage } from '../core/storage-service';

export interface Action {
    id: string;
    label: string;
    icon: string;
    scope: 'video' | 'playlist' | 'global';
    handler: (context: any) => Promise<void>;
    color?: string;
    code?: string;
}

export type CustomAction = Action;

export interface Macro {
    id: string;
    label: string;
    actionIds: string[];
}

class ActionService {
    private actions = writable<Action[]>([]);
    private macros = writable<Macro[]>([]);

    actionsStore = { subscribe: this.actions.subscribe };
    macrosStore = { subscribe: this.macros.subscribe };

    private readonly STORAGE_KEY = "custom_actions";
    private readonly MACRO_KEY = "user_macros";

    constructor() {
        this.init();
    }

    async init() {
        const savedRaw = await storage.get(this.STORAGE_KEY, []);
        const saved = savedRaw.map((a: any) => ({
            ...a,
            handler: a.code ? new Function('context', a.code) : a.handler
        }));

        const defaultActions: Action[] = [
            { id: 'dedupe', label: 'Remove Duplicates', icon: 'faClone', scope: 'playlist', handler: async (p) => { /* logic */ }, color: '#3b82f6' },
            { id: 'sort-alpha', label: 'Sort Alphabetically', icon: 'faSortAlphaDown', scope: 'playlist', handler: async (p) => { /* logic */ }, color: '#10b981' },
            { id: 'sync-all', label: 'Sync Everything', icon: 'faSync', scope: 'global', handler: async () => { /* logic */ }, color: '#f59e0b' },
            { id: 'nav-market', label: 'Go to Marketplace', icon: 'faStore', scope: 'global', handler: async () => { window.location.hash = '#/marketplace'; }, color: '#6366f1' }
        ];
        this.actions.set([...defaultActions, ...saved]);

        const savedMacros = await storage.get(this.MACRO_KEY, []);
        this.macros.set(savedMacros);
    }

    async registerAction(action: Action) {
        this.actions.update(a => [...a, action]);
        const currentActions = await storage.get(this.STORAGE_KEY, []);
        const toSave = { ...action };
        delete (toSave as any).handler;
        await storage.set(this.STORAGE_KEY, [...currentActions, toSave]);
    }

    async executeAction(actionId: string, context: any) {
        let allActions: Action[] = [];
        this.actions.subscribe(a => allActions = a)();
        const action = allActions.find(a => a.id === actionId);
        if (action) {
            console.log(`Executing ${actionId}...`);
            await action.handler(context);
        }
    }

    async executeMacro(macroId: string, context: any) {
        let allMacros: Macro[] = [];
        this.macros.subscribe(m => allMacros = m)();
        const macro = allMacros.find(m => m.id === macroId);
        if (macro) {
            for (const actionId of macro.actionIds) {
                await this.executeAction(actionId, context);
            }
        }
    }

    async saveMacro(macro: Macro) {
        this.macros.update(m => {
            const index = m.findIndex(item => item.id === macro.id);
            if (index !== -1) {
                m[index] = macro;
                return [...m];
            }
            return [...m, macro];
        });
        let currentMacros: Macro[] = [];
        this.macros.subscribe(m => currentMacros = m)();
        await storage.set(this.MACRO_KEY, currentMacros);
    }
}

export const actionService = new ActionService();
