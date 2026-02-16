import { writable } from "svelte/store";
import type { Video, Playlist } from "../../types/model";

export interface CustomAction {
    id: string;
    label: string;
    icon: string;
    color: string;
    scope: 'video' | 'playlist' | 'global';
    handlerStr?: string; // JavaScript string for custom logic
    handler?: (context: any) => Promise<void>;
}

class ActionService {
    private actions = writable<CustomAction[]>([]);
    public actionsStore = { subscribe: this.actions.subscribe };
    private readonly STORAGE_KEY = "custom_actions";

    constructor() {
        this.loadActions();
    }

    private async loadActions() {
        const defaults: CustomAction[] = [
            {
                id: 'mark-all-watched',
                label: 'Mark All Watched',
                icon: 'faCheckDouble',
                color: '#28a745',
                scope: 'playlist',
                handler: async ({ playlist, videos, refresh }) => {
                    for (const v of videos) {
                        v.watched = true;
                        await window.videoService.saveVideoMetadata(v.videoId, { watched: true });
                    }
                    await refresh();
                }
            },
            {
                id: 'archive-watched',
                label: 'Archive Watched',
                icon: 'faArchive',
                color: '#6c757d',
                scope: 'playlist',
                handler: async ({ playlist, videos, refresh }) => {
                    const unwatched = videos.filter(v => !v.watched).map(v => v.videoId);
                    playlist.videos = unwatched;
                    await window.savePlaylist(playlist);
                    await refresh();
                }
            }
        ];

        const saved = await window.fetchObject(this.STORAGE_KEY, []);
        const customized = saved.map(a => ({
            ...a,
            handler: a.handlerStr ? new Function('context', `return (async (context) => { ${a.handlerStr} })(context)`) : null
        })).filter(a => a.handler);

        this.actions.set([...defaults, ...customized]);
    }

    public async registerAction(action: CustomAction) {
        const saved = await window.fetchObject(this.STORAGE_KEY, []);
        saved.push({
            id: action.id,
            label: action.label,
            icon: action.icon,
            color: action.color,
            scope: action.scope,
            handlerStr: action.handlerStr
        });
        await window.storeObject(this.STORAGE_KEY, saved);
        await this.loadActions();
    }

    public async executeAction(actionId: string, context: any) {
        let action: CustomAction;
        const unsubscribe = this.actions.subscribe(all => {
            action = all.find(a => a.id === actionId);
        });
        unsubscribe();

        if (action) {
            console.log(`Executing action: ${action.label}`);
            try {
                await action.handler(context);
                window.success(`Action successful: ${action.label}`);
            } catch (e) {
                window.error(`Action failed: ${e.message}`);
            }
        }
    }
}

export const actionService = new ActionService();
