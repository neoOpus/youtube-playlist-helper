import { describe, it, expect } from 'vitest';
import { playlistService } from './playlist-service';
import type { Video } from '../types/model';

describe('playlistService', () => {
  it('should remove duplicate videos by ID', () => {
    const videos = [
      { videoId: '1', title: 'Video 1', channel: 'Channel A' },
      { videoId: '1', title: 'Video 1 Duplicate', channel: 'Channel A' },
      { videoId: '2', title: 'Video 2', channel: 'Channel B' }
    ] as Video[];

    const { uniqueVideos, duplicatesCount } = playlistService.removeDuplicates(videos);

    expect(uniqueVideos).toHaveLength(2);
    expect(duplicatesCount).toBe(1);
    expect(uniqueVideos[0].videoId).toBe('1');
    expect(uniqueVideos[1].videoId).toBe('2');
  });

  it('should remove duplicate videos by Title and Channel', () => {
    const videos = [
      { videoId: '1', title: 'Same Content', channel: 'Author' },
      { videoId: '2', title: 'Same Content', channel: 'Author' },
      { videoId: '3', title: 'Different Content', channel: 'Author' }
    ] as Video[];

    const { uniqueVideos, duplicatesCount } = playlistService.removeDuplicates(videos);

    expect(uniqueVideos).toHaveLength(2);
    expect(duplicatesCount).toBe(1);
    expect(uniqueVideos[0].videoId).toBe('1');
    expect(uniqueVideos[1].videoId).toBe('3');
  });

  it('should be case-insensitive for Title and Channel matching', () => {
    const videos = [
      { videoId: '1', title: 'MUSIC VIDEO', channel: 'Artist' },
      { videoId: '2', title: 'music video', channel: 'artist' }
    ] as Video[];

    const { uniqueVideos, duplicatesCount } = playlistService.removeDuplicates(videos);

    expect(uniqueVideos).toHaveLength(1);
    expect(duplicatesCount).toBe(1);
  });
});
