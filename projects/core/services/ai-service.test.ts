import { describe, it, expect } from 'vitest';
import { aiService } from './ai-service.js';
import type { Video } from '../types/model.js';

describe('aiService', () => {
    const mockVideo: Video = {
        id: 'v1',
        videoId: 'abc',
        url: 'https://youtube.com/watch?v=abc',
        title: 'Lofi Music for Coding',
        channel: 'Lofi Girl',
        thumbnailUrl: ''
    };

    it('should assign a Chill vibe to lofi music', async () => {
        const enrichment = await aiService.analyzeVideo(mockVideo);
        expect(enrichment.energyVibe).toBe('Chill');
    });

    it('should assign Educational vibe to courses', async () => {
        const enrichment = await aiService.analyzeVideo({ ...mockVideo, title: 'Rust Programming Course' });
        expect(enrichment.energyVibe).toBe('Educational');
    });

    it('should calculate relevance correctly', () => {
        const video: Video = {
            ...mockVideo,
            aiTags: ['Programming', 'Svelte'],
            rating: 5
        };
        const score = aiService.calculateVideoRelevance(video, ['svelte']);
        expect(score).toBeGreaterThan(15); // Tag match (15) + rating boost
    });
});
