import { storageService } from "./storage-service.js";
import { historyService } from "./history-service.js";
import type { Video } from "../types/model.js";

export const metadataService = {
    async saveVideoMetadata(videoId: string, metadata: Partial<Video>) {
        const existing = await storageService.fetchObject(`v_meta_${videoId}`, {});
        const updated = { ...existing, ...metadata, videoId };

        // Log to time machine if critical metadata changed
        if (metadata.title || metadata.channel) {
            await historyService.logHistory(videoId, updated.title, updated.channel);
        }

        await storageService.storeObject(`v_meta_${videoId}`, updated);
    },

    async getVideoMetadata(videoId: string): Promise<Partial<Video>> {
        return storageService.fetchObject(`v_meta_${videoId}`, {});
    },

    async bulkUpdateMetadata(videoIds: string[], updates: Partial<Video>) {
        for (const id of videoIds) {
            await this.saveVideoMetadata(id, updates);
        }
    }
};
