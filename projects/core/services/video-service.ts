import type { Playlist } from "../types/model.js";
import { metadataService } from "./metadata-service.js";
import { storageService } from "./storage-service.js";

let videoIdCount = 100;

// https://regex101.com/r/rq2KLv/1
export const youtubeRegexPattern =
  /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/.source;

class VideoService {
  YOUTUBE_URL_PREFIX = "https://www.youtube.com/watch?v=";
  THUMBNAIL_URL_PREFIX = "https://i.ytimg.com/vi/";
  THUMBNAIL_URL_SUFFIX = "/default.jpg";

  youtubeServiceURL = (globalThis as any).youtubeServiceURL || "https://www.youtube.com";

  async fetchVideo(videoId: string, sessionOnly = false) {
    let title = "";
    let channel = "";
    let sessionVideoData = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(videoId) : null;
    if (!sessionOnly && !sessionVideoData) {
      try {
        const res = await fetch(
          `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
        );
        const json = await res.json();
        title = json.title;
        channel = json.author_name;
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(videoId, JSON.stringify({ title, channel }));
        }
      } catch (e) {
        console.log(e);
      }
    } else if (sessionVideoData) {
      ({ title, channel } = JSON.parse(sessionVideoData));
    } else {
      title = "";
      channel = "";
    }
    const metadata = await metadataService.getVideoMetadata(videoId);
    return {
      id: videoIdCount++,
      videoId,
      url: this.YOUTUBE_URL_PREFIX + videoId,
      title,
      channel,
      thumbnailUrl: this.getVideoThumbnailUrl(videoId),
      ...metadata,
    };
  }

  getVideoThumbnailUrl(videoId: string) {
    if (!videoId) {
      return null;
    }
    return this.THUMBNAIL_URL_PREFIX + videoId + this.THUMBNAIL_URL_SUFFIX;
  }

  parseYoutubeId(url: string) {
    const result = RegExp(youtubeRegexPattern, "i").exec(url);
    if (result && result.length > 1) {
      return result[1];
    }
    return null;
  }

  parseYoutubeIds(text: string) {
    let matches: RegExpExecArray | null;
    let videoIds: string[] = [];
    const regex = RegExp(youtubeRegexPattern, "ig");
    while ((matches = regex.exec(text))) {
      videoIds.push(matches[1]);
    }
    return videoIds;
  }

  async generatePlaylist(videoIds?: string[], title?: string) {
    const id = await storageService.generatePlaylistId();
    const date = new Date();
    return {
      id,
      title: title ?? date.toLocaleString(),
      videos: videoIds || [],
      timestamp: date.getTime(),
    };
  }

  openPlaylistEditor(playlist: Playlist) {
    if (typeof history !== 'undefined') {
        const previousPage =
          location.hash.length > 0 ? location.hash.substring(1) : "/";
        history.pushState({ playlist, previousPage }, "", "#/editor");
        window.dispatchEvent(new Event("hashchange"));
    }
  }

  PLAYLIST_LIMIT = 50;
  async openPlaylist(videoIds: string[]) {
    const remainingVideoIds = [...videoIds];
    const videoIdsChunks = new Array(Math.ceil(remainingVideoIds.length / this.PLAYLIST_LIMIT))
        .fill(null)
        .map(() => remainingVideoIds.splice(0, this.PLAYLIST_LIMIT));

    const settings = await storageService.getSettings();
    await Promise.all(
      videoIdsChunks.map(async (videoIds) => {
        const video_ids = videoIds.join(",");
        let url = `${this.youtubeServiceURL}/watch_videos?video_ids=${video_ids}`;
        const data = await (await fetch(url)).text();
        const matches = /og:video:url[^>]+\?list=([^"']+)/.exec(data);
        const listId = matches ? matches[1] : null;
        if (listId) {
          if (settings.openPlaylistPage) {
            url = `https://www.youtube.com/playlist?list=${listId}`;
          } else {
            url = `https://www.youtube.com/watch?v=${videoIds[0]}&list=${listId}`;
            // Fix playlist not displayed
            await Promise.all([
              fetch(
                `${this.youtubeServiceURL}/watch?v=${videoIds[0]}&list=${listId}`
              ),
              fetch(
                `${this.youtubeServiceURL}/watch?v=${videoIds[0]}&list=${listId}`
              ),
            ]);
          }
        } else if (settings.openPlaylistPage) {
          console.error("Unable to retrieve playlist id. Directly playing videos instead...");
        }
        if (typeof browser != "undefined" && browser.tabs) {
          return browser.tabs.create({ url });
        } else {
          window.open(url, "_blank");
        }
      })
    );
  }
}

export const videoService = new VideoService();

// Legacy support
if (typeof window !== 'undefined') {
    (window as any).videoService = videoService;
}
