import { storageService } from "./storage-service.js";
import { aiService } from "./ai-service.js";
import { heartbeatService } from "./heartbeat-service.js";

let enrichmentInterval: ReturnType<typeof setInterval> | null = null;
let lastPlaylistIndex = 0;
let lastVideoIndex = 0;
const AGENT_ID = 'enrichment-agent';

/**
 * Enrichment Agent: A background service that incrementally scans and
 * enriches infrastructure nodes with AI metadata.
 */
export const enrichmentAgent = {
    async start() {
        if (enrichmentInterval) return;
        heartbeatService.registerAgent(AGENT_ID, "AI Enrichment Agent");

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
        const allSettings = await storageService.getSettings();
        const aiSettings = allSettings.ai;

        if (!aiSettings?.enabled) {
            heartbeatService.updateAgent(AGENT_ID, { state: 'suspended', message: 'AI Enrichment Disabled' });
            return;
        }

        const playlists = await storageService.getPlaylists();
        if (playlists.length === 0) {
            heartbeatService.updateAgent(AGENT_ID, { state: 'idle', message: 'Infrastructure empty.' });
            return;
        }

        heartbeatService.updateAgent(AGENT_ID, { state: 'working', message: 'Scanning sectors...' });

        let processedCount = 0;
        const BATCH_SIZE = 10;

        if (lastPlaylistIndex >= playlists.length) {
            lastPlaylistIndex = 0;
            lastVideoIndex = 0;
        }

        let currentPlIdx = lastPlaylistIndex;
        let currentVidIdx = lastVideoIndex;

        let iterations = 0;
        const maxIterations = playlists.length;

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
                heartbeatService.updateAgent(AGENT_ID, { activeNodeId: video.videoId, message: `Optimizing ${video.title.slice(0, 15)}...` });
                const enrichment = await aiService.analyzeVideo(video);

                if (enrichment && Object.keys(enrichment).length > 0) {
                    videos[currentVidIdx] = { ...video, ...enrichment };
                    await storageService.savePlaylist(pl);
                    processedCount++;
                }
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

        heartbeatService.updateAgent(AGENT_ID, {
            state: 'idle',
            message: processedCount > 0 ? `Batch complete. ${processedCount} nodes optimized.` : 'Infrastructure synchronized.'
        });
    },

    stop() {
        if (enrichmentInterval) {
            clearInterval(enrichmentInterval);
            enrichmentInterval = null;
        }
        heartbeatService.updateAgent(AGENT_ID, { state: 'suspended' });
    }
};
