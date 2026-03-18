import { describe, it, expect } from 'vitest';
import { aiService } from './ai-service.js';
import type { Video, Playlist } from '../types/model.js';

describe('aiService - Performance & Relevance Logic', () => {
    const mockVideos: Video[] = [
        { id: '1', videoId: 'v1', title: 'React Tutorial 2024', url: '', channel: 'C1', thumbnailUrl: '' },
        { id: '2', videoId: 'v2', title: 'Favorite Music Mix', url: '', channel: 'C2', thumbnailUrl: '' }
    ];

    it('should correctly calculate video relevance with semantic expansion', () => {
        const keywords = ['coding']; // Should match 'tutorial' in title via expansion
        const score = aiService.calculateVideoRelevance(mockVideos[0], aiService.expandKeywords(keywords));
        expect(score).toBeGreaterThan(0);
    });

    it('should sort videos by relevance', () => {
        const keywords = ['music'];
        const sorted = aiService.sortByRelevance(mockVideos, keywords);
        expect(sorted[0].title).toContain('Music');
    });

    it('should generate playlist summary', async () => {
        const mockPlaylist: Playlist = { id: 'p1', title: 'T1', videos: [], timestamp: 0 };
        const summary = await aiService.summarizePlaylist(mockPlaylist, mockVideos);
        expect(summary).toContain('collection of 2 videos');
    });
});
