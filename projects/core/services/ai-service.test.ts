import { describe, it, expect } from 'vitest';
import { aiService } from './ai-service';
import type { Video } from '../types/model';

describe('aiService', () => {
  it('should suggest groups based on keywords', async () => {
    const videos: Video[] = [
      { title: 'Learn Svelte 5 Tutorial', videoId: 'v1', url: '', channel: '', id: '1' },
      { title: 'Official Music Video', videoId: 'v2', url: '', channel: '', id: '2' }
    ];
    const groups = await aiService.suggestPlaylistGroups(videos);
    expect(groups).toContain('Education');
    expect(groups).toContain('Music');
  });

  it('should calculate relevance scores', () => {
    const video: Video = {
        title: 'Svelte 5 Guide',
        aiSummary: 'Tech talk',
        aiTags: ['Svelte'],
        videoId: 'v1',
        url: '',
        channel: '',
        id: '1'
    };
    const score = aiService.calculateVideoRelevance(video, ['svelte', 'guide']);
    expect(score).toBeGreaterThan(2); // Should get bonus for title matches
  });
});
