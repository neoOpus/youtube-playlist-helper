import { storageService } from "./storage-service.js";
import { aiService } from "./ai-service.js";
import { heartbeatService } from "./heartbeat-service.js";

let enrichmentInterval: ReturnType<typeof setInterval> | null = null;
let lastPlaylistIndex = 0;
let lastVideoIndex = 0;
const AGENT_ID = 'enrichment-agent';

export const enrichmentAgent = {
    async start() {
        console.log("Enrichment Agent online. Monitoring infrastructure...");
        heartbeatService.registerAgent(AGENT_ID, "Neural Enrichment Agent");
        if (enrichmentInterval) return;

        enrichmentInterval = setInterval(async () => {
            const { ai: settings } = await aiService.getSettings();
            if (!settings.enabled) {
                heartbeatService.updateAgent(AGENT_ID, { state: 'suspended', message: 'Manual suspension via settings.' });
                return;
            }
            await this.processQueue();
        }, 60000);

        await this.processQueue();
    },

    async processQueue() {
        heartbeatService.updateAgent(AGENT_ID, { state: 'working', message: 'Scanning sectors...' });
        const playlists = await storageService.getPlaylists();
        if (playlists.length === 0) {
            heartbeatService.updateAgent(AGENT_ID, { state: 'idle', message: 'Infrastructure empty.' });
            return;
        }

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
                heartbeatService.updateAgent(AGENT_ID, {
                    message: `Enriching: ${video.title.substring(0, 20)}...`,
                    progress: Math.round((processedCount / BATCH_SIZE) * 100),
                    activeNodeId: video.id // SOTA Tracking
                });
                const enrichment = await aiService.analyzeVideo(video);
                videos[currentVidIdx] = { ...video, ...enrichment };
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

        heartbeatService.updateAgent(AGENT_ID, {
            state: 'idle',
            message: processedCount > 0 ? `Batch complete. ${processedCount} nodes optimized.` : 'Infrastructure at maximum resonance.',
            progress: 100,
            activeNodeId: undefined
        });
    },

    stop() {
        if (enrichmentInterval) {
            clearInterval(enrichmentInterval);
            enrichmentInterval = null;
        }
        heartbeatService.updateAgent(AGENT_ID, { state: 'suspended', activeNodeId: undefined });
    }
};
