import { storageService } from "./storage-service.js";
import { alternativesService } from "./alternatives-service.js";
import { notificationService } from "./utils.js";
import { heartbeatService } from "./heartbeat-service.js";
import type { Video } from "../types/model.js";

let recoveryInterval: ReturnType<typeof setInterval> | null = null;
const AGENT_ID = 'recovery-agent';

export const recoveryAgent = {
    async start() {
        if (recoveryInterval) return;
        heartbeatService.registerAgent(AGENT_ID, "Autonomous Recovery Agent");

        // Proactive check every 2 hours
        recoveryInterval = setInterval(async () => {
            await this.scanForDeadNodes();
        }, 7200000);

        // Initial scan
        this.scanForDeadNodes();
    },

    async scanForDeadNodes() {
        heartbeatService.updateAgent(AGENT_ID, { state: 'working', message: 'Auditing integrity...' });
        const playlists = await storageService.getPlaylists();
        let deadFound = 0;

        for (const pl of playlists) {
            if (!pl.loadedVideos) continue;
            for (const video of pl.loadedVideos) {
                if (video.title === "Unknown Video" || !video.title) {
                    await this.attemptRecovery(video, pl.id);
                    deadFound++;
                }
            }
        }

        heartbeatService.updateAgent(AGENT_ID, {
            state: 'idle',
            message: deadFound > 0 ? `Audit complete. ${deadFound} nodes require triage.` : 'Infrastructure integrity verified.',
            progress: 100
        });
    },

    async attemptRecovery(video: Video, playlistId: string) {
        heartbeatService.updateAgent(AGENT_ID, { activeNodeId: video.videoId });
        const isDead = await alternativesService.isVideoUnavailable(video.videoId);

        if (isDead) {
            notificationService.info(`Node OFFLINE: "${video.title || video.videoId}". Recovery protocols recommended.`);
        }
    },

    stop() {
        if (recoveryInterval) {
            clearInterval(recoveryInterval);
            recoveryInterval = null;
        }
        heartbeatService.updateAgent(AGENT_ID, { state: 'suspended' });
    }
};
