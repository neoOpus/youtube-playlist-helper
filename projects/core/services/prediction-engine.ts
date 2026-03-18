import { storageService } from "./storage-service.js";
import { historyService } from "./history-service.js";

export const predictionEngine = {
    async predictMetadata(videoId: string) {
        const history = await historyService.getHistory(videoId);
        if (history.length > 0) {
            return {
                title: history[0].title,
                channel: history[0].channel
            };
        }

        // Secondary fallback: scan other playlists for this videoId
        const playlists = await storageService.getPlaylists();
        for (const pl of playlists) {
            const match = pl.loadedVideos?.find(v => v.videoId === videoId && v.title !== "Unknown Video");
            if (match) {
                return {
                    title: match.title,
                    channel: match.channel
                };
            }
        }

        return null;
    }
};
