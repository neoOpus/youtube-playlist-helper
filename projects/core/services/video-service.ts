import type { Video } from "../types/model.js";

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
            title: "Loading video...",
            channel: "YouTube",
            thumbnailUrl: this.getVideoThumbnailUrl(videoId),
            duration: "0:00",
            durationSeconds: 0
        };
    },

    async fetchVideo(videoId: string): Promise<Video | null> {
        let title = "YouTube Video";
        let channel = "Channel";

        try {
            const res = await fetch(
                `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
            );
            const json = await res.json();
            title = json.title || "YouTube Video";
            channel = json.author_name || "Channel";
        } catch (e) {
            console.error("Error fetching video info:", e);
        }

        return {
            id: videoIdCount++,
            videoId,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            title,
            channel,
            thumbnailUrl: this.getVideoThumbnailUrl(videoId),
            duration: "0:00",
            durationSeconds: 0
        };
    }
};
