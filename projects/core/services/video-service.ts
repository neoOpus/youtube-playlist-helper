import type { Playlist, Video } from "../types/model";
import { metadataService } from "./metadata-service";
import { storageService } from "./storage-service";

/**
 * Internal counter for assigning unique numerical IDs to video objects in a session.
 */
let videoIdCount = 100;

/**
 * Regex pattern for matching YouTube video IDs from various URL formats.
 * @see https://regex101.com/r/rq2KLv/1
 */
export const youtubeRegexPattern =
  /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/.source;

/**
 * Service for interacting with YouTube video data and URLs.
 */
class VideoService {
  private readonly YOUTUBE_URL_PREFIX = "https://www.youtube.com/watch?v=";
  private readonly THUMBNAIL_URL_PREFIX = "https://i.ytimg.com/vi/";
  private readonly THUMBNAIL_URL_SUFFIX = "/default.jpg";

  /**
   * The base URL for YouTube service calls, configurable via globalThis.
   */
  private readonly youtubeServiceURL = (globalThis as any).youtubeServiceURL || "https://www.youtube.com";

  /**
   * Fetches video information, including metadata.
   * @param videoId The YouTube video ID.
   * @param sessionOnly If true, only fetches data from session cache or returns empty.
   * @returns A promise resolving to a Video object.
   */
  async fetchVideo(videoId: string, sessionOnly = false): Promise<Video> {
    let title = "";
    let channel = "";
    let sessionVideoData = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(videoId) : null;

    if (!sessionOnly && !sessionVideoData) {
      try {
        const res = await fetch(
          `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
        );
        const json = await res.json();
        title = json.title || "";
        channel = json.author_name || "";
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(videoId, JSON.stringify({ title, channel }));
        }
      } catch (e) {
        console.error("Error fetching video info from noembed:", e);
      }
    } else if (sessionVideoData) {
      const parsed = JSON.parse(sessionVideoData);
      title = parsed.title;
      channel = parsed.channel;
    }

    const metadata = await metadataService.getVideoMetadata(videoId);

    return {
      id: videoIdCount++,
      videoId,
      url: this.YOUTUBE_URL_PREFIX + videoId,
      title,
      channel,
      thumbnailUrl: this.getVideoThumbnailUrl(videoId) || "",
      ...metadata,
    };
  }

  /**
   * Generates the thumbnail URL for a video.
   * @param videoId The YouTube video ID.
   * @returns The thumbnail URL.
   */
  getVideoThumbnailUrl(videoId: string): string | null {
    if (!videoId) return null;
    return this.THUMBNAIL_URL_PREFIX + videoId + this.THUMBNAIL_URL_SUFFIX;
  }

  /**
   * Parses a single YouTube video ID from a URL.
   * @param url The YouTube URL.
   * @returns The video ID or null if not matched.
   */
  parseYoutubeId(url: string): string | null {
    const result = RegExp(youtubeRegexPattern, "i").exec(url);
    return result && result.length > 1 ? result[1] : null;
  }

  /**
   * Parses all YouTube video IDs from a block of text.
   * @param text The text containing YouTube URLs.
   * @returns An array of unique video IDs.
   */
  parseYoutubeIds(text: string): string[] {
    let matches: RegExpExecArray | null;
    const videoIds: Set<string> = new Set();
    const regex = RegExp(youtubeRegexPattern, "ig");
    while ((matches = regex.exec(text))) {
      videoIds.add(matches[1]);
    }
    return Array.from(videoIds);
  }

  /**
   * Generates a new Playlist object.
   * @param videoIds Initial video IDs.
   * @param title Playlist title.
   * @returns A promise resolving to the new Playlist.
   */
  async generatePlaylist(videoIds?: string[], title?: string): Promise<Playlist> {
    const id = await storageService.generatePlaylistId();
    const date = new Date();
    return {
      id,
      title: title ?? date.toLocaleString(),
      videos: videoIds || [],
      timestamp: date.getTime(),
    };
  }

  /**
   * Opens multiple videos as a YouTube playlist in a new tab.
   * @param videoIds Array of video IDs.
   */
  async openPlaylist(videoIds: string[]) {
    if (videoIds.length === 0) return;

    const PLAYLIST_LIMIT = 50;
    const remainingVideoIds = [...videoIds];
    const videoIdsChunks = [];
    while (remainingVideoIds.length > 0) {
        videoIdsChunks.push(remainingVideoIds.splice(0, PLAYLIST_LIMIT));
    }

    const settings = await storageService.getSettings();

    await Promise.all(
      videoIdsChunks.map(async (chunk) => {
        const idsString = chunk.join(",");
        let url = `${this.youtubeServiceURL}/watch_videos?video_ids=${idsString}`;

        try {
            const data = await (await fetch(url)).text();
            const matches = /og:video:url[^>]+\?list=([^"']+)/.exec(data);
            const listId = matches ? matches[1] : null;

            if (listId) {
              if (settings.openPlaylistPage) {
                url = `https://www.youtube.com/playlist?list=${listId}`;
              } else {
                url = `https://www.youtube.com/watch?v=${chunk[0]}&list=${listId}`;
                // Warm up the playlist by fetching it twice (fixes YT quirk)
                await Promise.all([
                  fetch(`${this.youtubeServiceURL}/watch?v=${chunk[0]}&list=${listId}`),
                  fetch(`${this.youtubeServiceURL}/watch?v=${chunk[0]}&list=${listId}`),
                ]);
              }
            }
        } catch (err) {
            console.warn("Failed to retrieve YouTube listId, using fallback URL:", err);
        }

        if (typeof browser !== "undefined" && browser.tabs) {
          return browser.tabs.create({ url });
        } else {
          window.open(url, "_blank");
        }
      })
    );
  }
}

export const videoService = new VideoService();

// Global legacy support
if (typeof window !== 'undefined') {
    (window as any).videoService = videoService;
}
