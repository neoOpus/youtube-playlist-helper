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
      expect(score).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
        const video = {
            title: 'ROCK MUSIC',
            aiSummary: 'Classic Rock',
            aiTags: ['Rock']
        } as Video;
        const keywords = ['rock'];

        const score = aiService.calculateVideoRelevance(video, keywords);
        expect(score).toBeGreaterThan(0);
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
        expect(score).toBeGreaterThan(0);
    });
  });
});
