// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { storageService } from './storage-service';
import type { Video, Playlist } from '../types/model';

describe('Performance Profiling: Mass Data Operations', () => {
  const NODE_COUNT = 30000;

  it('should measure memory efficiency during 30k node decommissioning', async () => {
    const videos: Video[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
      videoId: `profile-${i}`,
      title: `Profile Node ${i}`,
      channel: 'C',
      thumbnailUrl: '',
      rating: 1
    }));

    const pl: Playlist = {
      id: 'profile-pl',
      title: 'Profiling Playlist',
      videos: videos.map(v => v.videoId),
      loadedVideos: videos,
      timestamp: Date.now(),
      saved: true
    };

    const initialMem = process.memoryUsage().heapUsed;

    // Perform mass storage
    await storageService.savePlaylist(pl);
    const afterSaveMem = process.memoryUsage().heapUsed;

    // Perform mass removal
    await storageService.removePlaylist(pl);
    const afterRemoveMem = process.memoryUsage().heapUsed;

    const saveOverhead = (afterSaveMem - initialMem) / 1024 / 1024;
    const leakPotential = (afterRemoveMem - initialMem) / 1024 / 1024;

    console.log(`[PROFILE] Heap Used (Initial): ${(initialMem / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[PROFILE] Heap Used (After 30k Save): ${(afterSaveMem / 1024 / 1024).toFixed(2)} MB (+ ${saveOverhead.toFixed(2)} MB)`);
    console.log(`[PROFILE] Heap Used (After 30k Remove): ${(afterRemoveMem / 1024 / 1024).toFixed(2)} MB (Delta: ${leakPotential.toFixed(2)} MB)`);

    expect(saveOverhead).toBeLessThan(100); // Expect < 100MB overhead for 30k nodes in memory
  });
});
