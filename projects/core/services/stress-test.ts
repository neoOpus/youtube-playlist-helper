import { storageService } from "./storage-service.js";
import { videoService } from "./video-service.js";
import { playlistsSorter } from "./playlists-sorter.js";
import type { Playlist, Video } from "../types/model.js";

export const stressTest = {
  /**
   * Generates a massive dataset to test UI and logic performance.
   * Target: 20,000 nodes.
   */
  async generateMassiveData(nodeCount = 20000) {
    console.log(`Neo-Stress Test: Generating ${nodeCount} nodes...`);
    const playlists: Playlist[] = [];
    const videosPerPlaylist = 100;
    const playlistCount = nodeCount / videosPerPlaylist;

    for (let i = 0; i < playlistCount; i++) {
        const videos: Video[] = [];
        for (let j = 0; j < videosPerPlaylist; j++) {
            videos.push({
                id: `stress-${i}-${j}`,
                videoId: `vid${j}`,
                url: 'https://youtube.com',
                title: `Stress Node ${i}-${j} for Performance Benchmarking`,
                channel: 'System stress',
                thumbnailUrl: '',
                rating: Math.floor(Math.random() * 5),
                dateAdded: Date.now()
            } as any);
        }

        playlists.push({
            id: `pl-stress-${i}`,
            title: `Sector Stress Node ${i}`,
            videos: videos.map(v => v.videoId),
            loadedVideos: videos,
            timestamp: Date.now(),
            saved: true
        });
    }

    console.log("Saving massive dataset to IndexedDB...");
    for (const pl of playlists) {
        await storageService.savePlaylist(pl);
    }
    console.log("Stress data commitment complete.");
  },

  async runBenchmark() {
      const start = performance.now();
      const playlists = await storageService.getPlaylists();
      const fetchTime = performance.now() - start;

      const sortStart = performance.now();
      await playlistsSorter.sort(playlists, 'title-az');
      const sortTime = performance.now() - sortStart;

      return {
          nodeCount: playlists.length * 100,
          fetchTime: Math.round(fetchTime),
          sortTime: Math.round(sortTime)
      };
  }
};
