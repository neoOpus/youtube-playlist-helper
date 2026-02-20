import { writable } from 'svelte/store';
import { storage } from '../core/storage-service';
import type { Video } from '../../types/model';

class StashService {
    private stash = writable<Video[]>([]);
    stashStore = { subscribe: this.stash.subscribe };

    private readonly STORAGE_KEY = "user_stash";

    constructor() {
        this.load();
    }

    async load() {
        const saved = await storage.get(this.STORAGE_KEY, []);
        this.stash.set(saved);
    }

    async addToStash(video: Video) {
        this.stash.update(s => {
            if (s.find(v => v.videoId === video.videoId)) return s;
            const updated = [...s, video];
            storage.set(this.STORAGE_KEY, updated);
            return updated;
        });
    }

    async removeFromStash(videoId: string) {
        this.stash.update(s => {
            const updated = s.filter(v => v.videoId !== videoId);
            storage.set(this.STORAGE_KEY, updated);
            return updated;
        });
    }

    async clearStash() {
        this.stash.set([]);
        await storage.remove(this.STORAGE_KEY);
    }
}

export const stashService = new StashService();
