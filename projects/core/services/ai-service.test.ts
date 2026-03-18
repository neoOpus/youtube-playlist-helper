import { describe, it, expect } from 'vitest';
import { aiService } from './ai-service';
import type { Video, Playlist } from '../types/model';

describe('aiService', () => {
  describe('calculateVideoRelevance', () => {
    it('should calculate basic relevance score', () => {
      const video = {
        title: 'Amazing Music Video',
        aiSummary: 'A great music video for testing',
        aiTags: ['music', 'test']
      } as Video;
      const keywords = ['music', 'test'];

      const score = aiService.calculateVideoRelevance(video, keywords);

      // 'music' matches text (+1) and title (+2) = 3
      // 'test' matches text (+1) = 1 (aiSummary contains 'testing', aiTags contains 'test')
      // Note: text = "amazing music video a great music video for testing music test"
      // Wait, aiTags.join(" ") = "music test"
      // text = "amazing music video a great music video for testing music test"
      // 'music' appears in text (multiple times, but includes() is boolean) -> +1
      // 'music' appears in title -> +2
      // Total for 'music' = 3
      // 'test' appears in text (in 'testing' and tags) -> +1
      // 'test' does NOT appear in title 'Amazing Music Video'
      // Total for 'test' = 1
      // Expected total = 4

      expect(score).toBe(4);
    });

    it('should be case-insensitive', () => {
        const video = {
            title: 'ROCK MUSIC',
            aiSummary: 'Classic Rock',
            aiTags: ['Rock']
        } as Video;
        const keywords = ['rock'];

        const score = aiService.calculateVideoRelevance(video, keywords);
        // 'rock' matches text (+1) and title (+2) = 3
        expect(score).toBe(3);
    });
  });

  describe('calculatePlaylistRelevance', () => {
    it('should calculate basic relevance score for playlist', () => {
        const playlist = {
            title: 'My Favorite Songs',
            groups: ['Music', '2024']
        } as Playlist;
        const keywords = ['music', 'songs'];

        const score = aiService.calculatePlaylistRelevance(playlist, keywords);
        // 'music' matches text (in groups) (+1)
        // 'songs' matches text (in title) (+1) and title (+2) = 3
        // Total = 4
        expect(score).toBe(4);
    });
  });
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
