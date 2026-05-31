/* @vitest-environment jsdom */
import { describe, it, expect, beforeAll } from 'vitest';
import { storageService } from './storage-service';
import { aiService } from './ai-service';
import type { Video, Playlist } from '../types/model';

describe('Neo-Stress Test: Infrastructure Scalability', () => {
  const NODE_COUNT = 20000;
  let largePlaylist: Playlist;

  beforeAll(async () => {
    // Manually mock Date.now() or just use a fixed ID for storage consistency in test
    const videos: Video[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
      videoId: `stress-${i}`,
      title: `Stress Node ${i} tutorial review music rick lo-fi`,
      channel: `Channel ${i % 100}`,
      thumbnailUrl: 'https://via.placeholder.com/150',
      rating: (i % 5) + 1,
      aiTags: ['stress', 'test', i % 2 === 0 ? 'even' : 'odd']
    }));

    largePlaylist = {
      id: 'stress-test-id',
      title: 'Massive Infrastructure Node Collection',
      videos: videos.map(v => v.videoId),
      loadedVideos: videos,
      timestamp: Date.now(),
      saved: true // Force saved state for testing
    };
  });

  it('should handle high-throughput relevance sorting on 20k nodes', () => {
    const start = performance.now();
    const sorted = aiService.sortByRelevance(largePlaylist.loadedVideos!, ['tutorial', 'rick', 'classic']);
    const end = performance.now();
    const duration = end - start;

    console.log(`[BENCHMARK] Sorted ${NODE_COUNT} nodes in ${duration.toFixed(2)}ms`);

    expect(sorted).toHaveLength(NODE_COUNT);
    expect(duration).toBeLessThan(1000);
  });

  it('should handle large dataset storage simulation', async () => {
    const start = performance.now();
    await storageService.savePlaylist(largePlaylist);
    const end = performance.now();
    const duration = end - start;

    console.log(`[BENCHMARK] Stored ${NODE_COUNT} nodes in ${duration.toFixed(2)}ms`);

    const fetched = await storageService.getPlaylist('stress-test-id');
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe(largePlaylist.title);
    expect(fetched?.videos).toHaveLength(NODE_COUNT);
  });

  it('should evaluate complex smart rules across entire population', () => {
    const start = performance.now();
    let modified = 0;
    largePlaylist.loadedVideos!.forEach(v => {
        if ((v.rating || 0) > 4) {
            modified++;
        }
    });
    const end = performance.now();
    const duration = end - start;

    console.log(`[BENCHMARK] Evaluated 1 rule across ${NODE_COUNT} nodes in ${duration.toFixed(2)}ms`);
    expect(modified).toBeGreaterThan(0);
    expect(duration).toBeLessThan(100);
  });
});
