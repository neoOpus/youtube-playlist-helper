import { storageService } from "./storage-service.js";
import { alternativesService } from "./alternatives-service.js";
import { notificationService } from "./utils.js";
import { actionLogger } from "./action-logger.js";
import type { Video } from "../types/model.js";

let recoveryInterval: ReturnType<typeof setInterval> | null = null;

export const recoveryAgent = {
    async start() {
        if (recoveryInterval) return;
        console.log("Recovery Agent online. Monitoring node availability...");

        // Proactive check every 2 hours
        recoveryInterval = setInterval(async () => {
            await this.scanForDeadNodes();
        }, 7200000);

        // Initial scan
        this.scanForDeadNodes();
    },

    async scanForDeadNodes() {
        const playlists = await storageService.getPlaylists();
        for (const pl of playlists) {
            if (!pl.loadedVideos) continue;

            for (const video of pl.loadedVideos) {
                // If it looks like a dead node (Unknown Title) or we haven't checked it lately
                if (video.title === "Unknown Video" || !video.title) {
                    await this.attemptRecovery(video, pl.id);
                }
            }
        }
    },

    async attemptRecovery(video: Video, playlistId: string) {
        console.log(`Recovery Agent: Validating node "${video.videoId}"...`);
        const isDead = await alternativesService.isVideoUnavailable(video.videoId);

        if (isDead) {
            console.warn(`Recovery Agent: Node "${video.videoId}" is confirmed OFFLINE.`);
            const alts = alternativesService.getSearchUrls(video.title || "Unknown Video", video.videoId);

            // In Alpha, we notify the user with a direct link to the Wayback Machine or other mirrors
            notificationService.info(`Node OFFLINE: "${video.title || video.videoId}". Recovery protocols recommended.`);

            // Logic for automatic mirror linking would go here in Beta
        }
    },

    stop() {
        if (recoveryInterval) {
            clearInterval(recoveryInterval);
            recoveryInterval = null;
        }
    }
};
