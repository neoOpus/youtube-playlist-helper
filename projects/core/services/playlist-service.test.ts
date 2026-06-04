import { describe, it, expect } from 'vitest';
import { playlistService } from './playlist-service';

describe('playlistService', () => {
  it('should remove duplicate videos', () => {
    const videos = [
      { videoId: '1', title: 'V1' },
      { videoId: '2', title: 'V2' },
      { videoId: '1', title: 'V1-Dup' }
    ] as any;
    const { uniqueVideos, duplicatesCount } = playlistService.removeDuplicates(videos);
    expect(uniqueVideos.length).toBe(2);
    expect(duplicatesCount).toBe(1);
    expect(uniqueVideos[0].videoId).toBe('1');
  });
});
