import { describe, it, expect, vi } from 'vitest';
import { predictionEngine } from './prediction-engine.js';
import { storageService } from './storage-service.js';
import { historyService } from './history-service.js';

vi.mock('./storage-service.js');
vi.mock('./history-service.js');

describe('predictionEngine', () => {
    it('should predict metadata from history', async () => {
        vi.mocked(historyService.getHistory).mockResolvedValue([
            { videoId: 'v1', title: 'Historical Title', channel: 'Historical Channel', timestamp: 123 }
        ]);

        const prediction = await predictionEngine.predictMetadata('v1');
        expect(prediction?.title).toBe('Historical Title');
    });

    it('should fallback to scanning other playlists', async () => {
        vi.mocked(historyService.getHistory).mockResolvedValue([]);
        vi.mocked(storageService.getPlaylists).mockResolvedValue([
            {
                id: 'p1', title: 'P1', videos: ['v1'], timestamp: 0,
                loadedVideos: [{ videoId: 'v1', title: 'Found Title', channel: 'Found Channel' } as any]
            }
        ] as any);

        const prediction = await predictionEngine.predictMetadata('v1');
        expect(prediction?.title).toBe('Found Title');
    });
});
