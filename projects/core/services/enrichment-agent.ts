import { storageService } from "./storage-service.js";
import { aiService } from "./ai-service.js";

let enrichmentInterval: ReturnType<typeof setInterval> | null = null;
let lastPlaylistIndex = 0;
let lastVideoIndex = 0;

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

    /**
     * Optimized processQueue: Uses a cursor-based approach to ensure scalability
     * across large infrastructure collections.
     */
    async processQueue() {
        const playlists = await storageService.getPlaylists();
        if (playlists.length === 0) return;

        let processedCount = 0;
        const BATCH_SIZE = 5; // Increased batch size for professional throughput

        // Reset cursors if playlists changed significantly
        if (lastPlaylistIndex >= playlists.length) {
            lastPlaylistIndex = 0;
            lastVideoIndex = 0;
        }

        let currentPlIdx = lastPlaylistIndex;
        let currentVidIdx = lastVideoIndex;

        // Flattened search starting from cursors
        let iterations = 0;
        const maxIterations = playlists.length; // Max full pass

        while (processedCount < BATCH_SIZE && iterations < maxIterations) {
            const pl = playlists[currentPlIdx];
            const videos = pl.loadedVideos || [];

            if (currentVidIdx >= videos.length) {
                currentVidIdx = 0;
                currentPlIdx = (currentPlIdx + 1) % playlists.length;
                iterations++;
                continue;
            }

            const video = videos[currentVidIdx];

            if (!video.aiSummary) {
                console.log(`Enrichment Agent: Processing node "${video.title}" in "${pl.title}"...`);
                const enrichment = await aiService.analyzeVideo(video);

                // Update node state
                videos[currentVidIdx] = { ...video, ...enrichment };

                // We save after each enrichment or at the end of playlist to ensure persistence
                await storageService.savePlaylist(pl);
                processedCount++;
            }

            currentVidIdx++;
            if (currentVidIdx >= videos.length) {
                currentVidIdx = 0;
                currentPlIdx = (currentPlIdx + 1) % playlists.length;
                iterations++;
            }
        }

        lastPlaylistIndex = currentPlIdx;
        lastVideoIndex = currentVidIdx;

        if (processedCount > 0) {
            console.log(`Enrichment Agent: Batch complete. ${processedCount} nodes optimized.`);
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
