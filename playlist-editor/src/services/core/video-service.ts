/// <reference path="../types/services.d.ts" />

import type { Playlist } from "../../types/model.js";
import { metadataService } from "../mega/metadata-service.js";
import { storage } from "./storage-service.js";
import { persistenceService } from "../mega/persistence-service";

const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|live\/))([-a-zA-Z0-9_]{11,})/;

class VideoService {
  YOUTUBE_URL_PREFIX = "https://www.youtube.com/watch?v=";
  THUMBNAIL_URL_PREFIX = "https://i.ytimg.com/vi/";
  THUMBNAIL_URL_SUFFIX = "/mqdefault.jpg";

  private requestQueue: Promise<any> = Promise.resolve();
  private cache = new Map();
  private videoIdCount = 100;

  async fetchVideo(videoId: string, sessionOnly = false) {
    const cached = await persistenceService.getCachedVideo(videoId);
    if (cached) return cached;
    if (this.cache.has(videoId)) return this.cache.get(videoId);

    const metadata = await metadataService.getVideoMetadata(videoId);
    let title = "";
    let channel = "";

    if (!sessionOnly) {
        const videoData = await (this.requestQueue = this.requestQueue.then(async () => {
            try {
                const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                if (!res.ok) throw new Error('API down');
                const json = await res.json();
                return { title: json.title, channel: json.author_name };
            } catch {
                return { title: "Private or Unavailable Video", channel: "Unknown" };
            } finally {
                await new Promise(r => setTimeout(r, 200));
            }
        }));
        title = videoData.title;
        channel = videoData.channel;
    }

    const videoObj = {
      id: this.videoIdCount++,
      videoId,
      url: this.YOUTUBE_URL_PREFIX + videoId,
      title,
      channel,
      thumbnailUrl: this.getVideoThumbnailUrl(videoId),
      ...metadata,
    };

    if (title) this.cache.set(videoId, videoObj);
    if (title) persistenceService.cacheVideo(videoObj);
    return videoObj;
  }

  getVideoThumbnailUrl(videoId: string) {
    return videoId ? `${this.THUMBNAIL_URL_PREFIX}${videoId}${this.THUMBNAIL_URL_SUFFIX}` : null;
  }

  parseYoutubeId(url: string) {
    const result = YOUTUBE_REGEX.exec(url);
    return (result && result.length > 1) ? result[1] : null;
  }

  parseYoutubeIds(text: string) {
    const regex = new RegExp(YOUTUBE_REGEX.source, "ig");
    const videoIds: string[] = [];
    let match;
    while ((match = regex.exec(text))) {
      videoIds.push(match[1]);
    }
    return [...new Set(videoIds)];
  }

  async saveVideoMetadata(videoId: string, metadata: any) {
    await metadataService.saveVideoMetadata(videoId, metadata);
  }

  async generatePlaylist(videoIds?: string[], title?: string) {
    const id = await storage.generatePlaylistId();
    const date = new Date();
    return {
      id,
      title: title ?? `Collection ${date.toLocaleDateString()}`,
      videos: videoIds || [],
      timestamp: date.getTime(),
      version: 1
    };
  }

  openPlaylistEditor(playlist: Playlist) {
    const previousPage = location.hash.length > 0 ? location.hash.substring(1) : "/";
    history.pushState({ playlist, previousPage }, "", "#/editor");
    window.dispatchEvent(new Event("hashchange"));
  }

  PLAYLIST_LIMIT = 50;
  async openPlaylist(videoIds: string[]) {
    const settings = await storage.getSettings();
    const chunks = [];
    for (let i = 0; i < videoIds.length; i += this.PLAYLIST_LIMIT) {
        chunks.push(videoIds.slice(i, i + this.PLAYLIST_LIMIT));
    }

    for (const chunk of chunks) {
        const video_ids = chunk.join(",");
        let url = `https://www.youtube.com/watch_videos?video_ids=${video_ids}`;

        try {
            const data = await (await fetch(url)).text();
            const match = /og:video:url[^>]+\?list=([^"']+)/.exec(data);
            const listId = match ? match[1] : null;

            if (listId) {
                url = settings.openPlaylistPage ?
                    `https://www.youtube.com/playlist?list=${listId}` :
                    `https://www.youtube.com/watch?v=${chunk[0]}&list=${listId}`;
            }

            if (typeof browser !== "undefined") {
                await browser.tabs.create({ url });
            } else {
                window.open(url, "_blank");
            }
        } catch (e) {
            console.error("Failed to generate YouTube player session.");
        }
    }
  }
}

export const videoService = new VideoService();
