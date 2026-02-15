import type { Video } from "../types/model.js";

export const playlistService = {
  removeDuplicates(videos: Video[]): {
    uniqueVideos: Video[];
    duplicatesCount: number;
  } {
    const seenIds = new Set<string>();
    const seenKeys = new Set<string>();
    const uniqueVideos: Video[] = [];
    let duplicatesCount = 0;

    for (const video of videos) {
      const videoId = video.videoId.toString();
      const title = video.title.toLowerCase().trim();
      const channel = video.channel.toLowerCase().trim();
      // Advanced key: title + channel to identify re-uploads or same content
      const key = title && channel ? `${title}|${channel}` : null;

      if (seenIds.has(videoId)) {
        duplicatesCount++;
      } else if (key && seenKeys.has(key)) {
        duplicatesCount++;
      } else {
        seenIds.add(videoId);
        if (key) {
          seenKeys.add(key);
        }
        uniqueVideos.push(video);
      }
    }

    return { uniqueVideos, duplicatesCount };
  },
};
