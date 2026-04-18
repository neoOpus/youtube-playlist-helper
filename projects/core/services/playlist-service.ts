import type { Video, Playlist, SmartRule } from "../types/model.js";

export const playlistService = {
  /**
   * Removes duplicate videos from an array based on unique ID and title/channel composite key.
   */
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
      if (seenIds.has(videoId)) {
        duplicatesCount++;
        continue;
      }

      const title = video.title ? video.title.toLowerCase().trim() : "";
      const channel = video.channel ? video.channel.toLowerCase().trim() : "";
      const key = title && channel ? `${title}|${channel}` : null;

      if (key && seenKeys.has(key)) {
        duplicatesCount++;
      } else {
        seenIds.add(videoId);
        if (key) seenKeys.add(key);
        uniqueVideos.push(video);
      }
    }

    return { uniqueVideos, duplicatesCount };
  },

  /**
   * Evaluates a smart rule against a video node.
   */
  evaluateRule(video: Video, rule: SmartRule): boolean {
      const { field, operator, value } = rule.condition;
      let actualValue: any;

      switch (field) {
          case 'rating': actualValue = video.rating || 0; break;
          case 'vibe': actualValue = video.energyVibe; break;
          case 'tag': actualValue = video.aiTags || []; break;
          case 'duration': actualValue = video.duration || ""; break;
          default: return false;
      }

      switch (operator) {
          case 'gt': return actualValue > value;
          case 'lt': return actualValue < value;
          case 'eq': return actualValue === value;
          case 'contains':
            if (Array.isArray(actualValue)) return actualValue.includes(value);
            return String(actualValue).includes(String(value));
          default: return false;
      }
  },

  /**
   * Applies a rule's action to a video. Returns true if modified.
   */
  applyAction(video: Video, rule: SmartRule): boolean {
      let modified = false;
      const { type, params } = rule.action;

      switch (type) {
          case 'tag':
              if (!video.aiTags) video.aiTags = [];
              if (!video.aiTags.includes(params.tag)) {
                  video.aiTags.push(params.tag);
                  modified = true;
              }
              break;
          case 'rate':
              if (video.rating !== params.rating) {
                  video.rating = params.rating;
                  modified = true;
              }
              break;
          case 'decommission':
              // This is usually handled at the playlist level by filtering out the video
              // or marking it for removal.
              video.selected = true; // Mark for decommissioning
              modified = true;
              break;
      }
      return modified;
  }
};
