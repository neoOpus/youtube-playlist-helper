import { writable } from "svelte/store";
import type { Video, Playlist } from "../../types/model";

export interface CustomAction {
    id: string;
    label: string;
    icon: string;
    color: string;
    scope: 'video' | 'playlist' | 'global';
    handler: (context: any) => Promise<void>;
}

class ActionService {
    private actions = writable<CustomAction[]>([]);
    public actionsStore = { subscribe: this.actions.subscribe };

    constructor() {
        this.loadDefaultActions();
    }

    private loadDefaultActions() {
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
        this.actions.set(defaults);
    }

    public registerAction(action: CustomAction) {
        this.actions.update(current => [...current, action]);
    }

    public async executeAction(actionId: string, context: any) {
        let action: CustomAction;
        this.actions.subscribe(all => {
            action = all.find(a => a.id === actionId);
        })();

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
