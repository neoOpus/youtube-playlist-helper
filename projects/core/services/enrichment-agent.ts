import { storageService } from "./storage-service.js";
import { aiService } from "./ai-service.js";

let enrichmentInterval: any = null;

/**
 * Enrichment Agent: A background service that incrementally scans and
 * enriches infrastructure nodes with AI metadata.
 * Part of the "Professional Edition" intelligence layer.
 */
export const enrichmentAgent = {
    async start() {
        console.log("Enrichment Agent online. Monitoring infrastructure...");
        if (enrichmentInterval) return;

        // Run every 60 seconds for background maintenance
        enrichmentInterval = setInterval(async () => {
            await this.processQueue();
        }, 60000);

        // Immediate first run
        await this.processQueue();
    },

    async processQueue() {
        const playlists = await storageService.getPlaylists();
        let processedCount = 0;
        const BATCH_SIZE = 2; // Low impact background processing

        for (const pl of playlists) {
            if (!pl.loadedVideos) continue;

            let playlistChanged = false;
            for (let i = 0; i < pl.loadedVideos.length; i++) {
                const video = pl.loadedVideos[i];

                // Check if node needs enrichment
                if (!video.aiSummary) {
                    console.log(`Enrichment Agent: Processing node "${video.title}"...`);
                    const enrichment = await aiService.analyzeVideo(video);

                    // Update local video object with AI signals
                    pl.loadedVideos[i] = { ...video, ...enrichment };
                    playlistChanged = true;
                    processedCount++;

                    // Limit processing per interval to maintain system responsiveness
                    if (processedCount >= BATCH_SIZE) {
                        await storageService.savePlaylist(pl);
                        console.log("Enrichment Agent: Interval batch complete. System intelligence density increased.");
                        return;
                    }
                }
            }

            if (playlistChanged) {
                await storageService.savePlaylist(pl);
            }
        }
    },

    stop() {
        if (enrichmentInterval) {
            clearInterval(enrichmentInterval);
            enrichmentInterval = null;
        }
        console.log("Enrichment Agent suspended.");
    }
};
