import type { Video, Playlist } from "../types/model.js";

export const playlistService = {
  /**
   * Removes duplicate videos from an array based on unique ID.
   */
  removeDuplicates(videos: Video[]): {
    uniqueVideos: Video[];
    duplicatesCount: number;
  } {
    const seenIds = new Set<string>();
    const uniqueVideos: Video[] = [];
    let duplicatesCount = 0;

    for (const video of videos) {
      const videoId = video.videoId.toString();
      if (seenIds.has(videoId)) {
        duplicatesCount++;
        continue;
      }
      seenIds.add(videoId);
      uniqueVideos.push(video);
    }

    return { uniqueVideos, duplicatesCount };
  }
};
