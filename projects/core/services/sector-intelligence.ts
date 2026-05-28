import { storageService } from "./storage-service.js";
import { aiService } from "./ai-service.js";
import { embeddingService } from "./embedding-service.js";
import type { Playlist, Video } from "../types/model.js";

export const sectorIntelligence = {
    /**
     * Calculates the centroid (average embedding vector) of a Sector.
     */
    calculateCentroid(videos: Video[]): number[] | null {
        const withEmbeds = videos.filter(v => v.embeddings && v.embeddings.length > 0);
        if (withEmbeds.length === 0) return null;

        const size = withEmbeds[0].embeddings!.length;
        const sum = new Array(size).fill(0);

        for (const v of withEmbeds) {
            for (let i = 0; i < size; i++) {
                sum[i] += v.embeddings![i];
            }
        }

        return sum.map(s => s / withEmbeds.length);
    },

    /**
     * Identifies logical Sectors for a given video based on semantic resonance.
     */
    async suggestSectors(video: Video): Promise<{ playlist: Playlist, confidence: number }[]> {
        const { useLocalEmbeddings } = await aiService.getSettings();
        if (!useLocalEmbeddings) return [];

        let videoEmbeddings = video.embeddings;
        if (!videoEmbeddings) {
            const enrichment = await aiService.analyzeVideo(video);
            videoEmbeddings = enrichment.embeddings;
        }
        if (!videoEmbeddings) return [];

        const playlists = await storageService.getPlaylists();
        const suggestions: { playlist: Playlist, confidence: number }[] = [];

        for (const pl of playlists) {
            if (!pl.loadedVideos || pl.loadedVideos.length === 0) continue;

            const centroid = this.calculateCentroid(pl.loadedVideos);
            if (centroid) {
                const similarity = embeddingService.cosineSimilarity(videoEmbeddings, centroid);
                if (similarity > 0.7) { // Threshold for "High Resonance"
                    suggestions.push({ playlist: pl, confidence: Math.round(similarity * 100) });
                }
            }
        }

        return suggestions.sort((a, b) => b.confidence - a.confidence);
    }
};
