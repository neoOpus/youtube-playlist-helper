import type { Video } from "../types/model.js";
import { metadataService } from "./metadata-service.js";

/**
 * Internal counter for assigning unique numerical IDs to video objects in a session.
 */
let videoIdCount = 1000;

export const videoService = {
    parseYoutubeIds(input: string): string[] {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
        const ids = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            ids.push(match[1]);
        }
        const rawIds = input.split(/\s+/).filter(s => /^[a-zA-Z0-9_-]{11}$/.test(s));
        return [...new Set([...ids, ...rawIds])];
    },

    parseYoutubeId(input: string): string | null {
        const ids = this.parseYoutubeIds(input);
        return ids.length > 0 ? ids[0] : null;
    },

    getVideoThumbnailUrl(videoId: string): string {
        return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    },

    createVideo(videoId: string): Video {
        return {
            id: videoIdCount++,
            videoId,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            title: "Loading node...",
            channel: "",
            thumbnailUrl: this.getVideoThumbnailUrl(videoId),
            dateAdded: Date.now()
        } as any;
    },

    async fetchVideo(videoId: string): Promise<Video | null> {
        let title = "Unknown Video";
        let channel = "";

        try {
            const res = await fetch(
                `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
            );
            const json = await res.json();
            title = json.title || "Unknown Video";
            channel = json.author_name || "";
        } catch (e) {
            console.error("Error fetching video info from noembed:", e);
        }

        const metadata = await metadataService.getVideoMetadata(videoId);

        return {
            id: videoIdCount++,
            videoId,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            title,
            channel,
            thumbnailUrl: this.getVideoThumbnailUrl(videoId),
            dateAdded: Date.now(),
            ...metadata
        } as any;
    }
};
