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
      // 'music' matches text and title (20) + 'test' matches text (10) = 30
      expect(score).toBe(30);
    });

    it('should be case-insensitive', () => {
        const video = {
            title: 'ROCK MUSIC',
            aiSummary: 'Classic Rock',
            aiTags: ['Rock']
        } as Video;
        const keywords = ['rock'];

        const score = aiService.calculateVideoRelevance(video, keywords);
        // 'rock' matches text and title = 20
        expect(score).toBe(20);
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
        // 'music' matches text (20) + 'songs' matches text and title (40) = 60
        expect(score).toBe(60);
    });
  });
});
