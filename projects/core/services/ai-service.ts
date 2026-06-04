import type { Video, Playlist } from "../types/model.js";

export const aiService = {
  /**
   * Simple keyword-based categorization.
   */
  async analyzeVideo(video: Video): Promise<Partial<Video>> {
    const title = (video.title || "").toLowerCase();
    const tags = [];

    if (title.includes("tutorial") || title.includes("how to")) tags.push("Educational");
    if (title.includes("music") || title.includes("official video")) tags.push("Music");
    if (title.includes("review")) tags.push("Review");

    return {
      aiTags: tags,
      aiSummary: "Basic analysis complete."
    };
  },

  calculateVideoRelevance(video: Video, keywords: string[]): number {
    if (!video || !keywords.length) return 0;
    let score = 0;
    const title = (video.title || "").toLowerCase();
    for (const k of keywords) {
      if (title.includes(k.toLowerCase())) score += 10;
    }
    return score;
  },

  sortByRelevance(videos: Video[], keywords: string[]): Video[] {
    if (!keywords.length) return videos;
    return [...videos].sort((a, b) =>
      this.calculateVideoRelevance(b, keywords) - this.calculateVideoRelevance(a, keywords)
    );
  }
};
