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
   * Evaluates a smart rule against a video node with strict typing.
   */
  evaluateRule(video: Video, rule: SmartRule): boolean {
      const { field, operator, value } = rule.condition;
      let actualValue: any;

      switch (field) {
          case 'rating': actualValue = Number(video.rating) || 0; break;
          case 'vibe': actualValue = String(video.energyVibe || ""); break;
          case 'tag': actualValue = video.aiTags || []; break;
          case 'duration': actualValue = String(video.duration || ""); break;
          default: return false;
      }

      // Normalize comparison value based on field type
      const normalizedValue = field === 'rating' ? Number(value) : value;

      switch (operator) {
          case 'gt': return actualValue > normalizedValue;
          case 'lt': return actualValue < normalizedValue;
          case 'eq': return actualValue === normalizedValue;
          case 'contains':
            if (Array.isArray(actualValue)) {
                return actualValue.some(v => String(v).toLowerCase().includes(String(normalizedValue).toLowerCase()));
            }
            return String(actualValue).toLowerCase().includes(String(normalizedValue).toLowerCase());
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
              const targetTag = String(params.tag);
              if (!video.aiTags.includes(targetTag)) {
                  video.aiTags.push(targetTag);
                  modified = true;
              }
              break;
          case 'rate':
              const targetRating = Number(params.rating);
              if (video.rating !== targetRating) {
                  video.rating = targetRating;
                  modified = true;
              }
              break;
          case 'decommission':
              // Marks for decommissioning using a dedicated boolean flag
              if (!video.selected) {
                video.selected = true;
                modified = true;
              }
              break;
      }
      return modified;
  }
};
