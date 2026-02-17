import { storage } from './storage-service';
import type { Video, Playlist } from "../../types/model";

export const playlistService = {
  removeDuplicates(videos: Video[]) {
    const seenIds = new Set();
    const seenTitles = new Set();
    const uniqueVideos = [];
    let duplicatesCount = 0;

    for (const video of videos) {
      // Normalize title for better duplicate detection
      const normalizedTitle = video.title?.toLowerCase().trim();
      const compositeKey = `${normalizedTitle}-${video.channel?.toLowerCase()}`;

      if (seenIds.has(video.videoId) || (video.title && seenTitles.has(compositeKey))) {
        duplicatesCount++;
      } else {
        seenIds.add(video.videoId);
        if (video.title) {
          seenTitles.add(compositeKey);
        }
        uniqueVideos.push(video);
      }
    }

    return { uniqueVideos, duplicatesCount };
  },

  async deduplicateAll() {
      const playlists = await storage.getPlaylists();
      let totalRemoved = 0;

      for (const p of playlists) {
          const loadedVideos = await Promise.all(p.videos.map(v => window.videoService.fetchVideo(v)));
          const { uniqueVideos, duplicatesCount } = this.removeDuplicates(loadedVideos);
          if (duplicatesCount > 0) {
              p.videos = uniqueVideos.map(v => v.videoId);
              await storage.savePlaylist(p);
              totalRemoved += duplicatesCount;
          }
      }
      return totalRemoved;
  },

  async findVideoInAllPlaylists(videoId: string) {
      const playlists = await storage.getPlaylists();
      return playlists.filter(p => p.videos.includes(videoId));
  }
};
