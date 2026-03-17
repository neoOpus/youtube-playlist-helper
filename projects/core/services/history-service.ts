import { storageService } from "./storage-service.js";
import type { Playlist } from "../types/model.js";

export interface VideoHistoryEntry {
    videoId: string;
    title: string;
    channel: string;
    timestamp: number;
}

const HISTORY_KEY_PREFIX = "v_history_";

export const historyService = {
    async logHistory(videoId: string, title: string, channel: string) {
        if (!videoId) return;

        const key = HISTORY_KEY_PREFIX + videoId;
        const history: VideoHistoryEntry[] = await storageService.fetchObject(key, []);

        const lastEntry = history[0];
        if (lastEntry && lastEntry.title === title && lastEntry.channel === channel) return;

        const newEntry: VideoHistoryEntry = { videoId, title, channel, timestamp: Date.now() };
        history.unshift(newEntry);

        // Keep last 10 versions
        await storageService.storeObject(key, history.slice(0, 10));
    },

    async getHistory(videoId: string): Promise<VideoHistoryEntry[]> {
        return storageService.fetchObject(HISTORY_KEY_PREFIX + videoId, []);
    },

    async captureSnapshot(playlist: Playlist) {
        // Mocking snapshot capture for undo
        console.log(`Snapshot captured for ${playlist.title}`);
    }
};
