import type { Video } from "../types/model";

/**
 * Service for AI-driven enrichment and intelligent operations.
 */
export const aiService = {
  /**
   * Analyzes a video and returns enrichment data.
   */
  async analyzeVideo(video: Video): Promise<Partial<Video>> {
    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const tags = ["YouTube", "Video"];
    if (video.title.toLowerCase().includes("music")) tags.push("Music");
    if (video.title.toLowerCase().includes("tutorial")) tags.push("Education");
    if (video.title.toLowerCase().includes("rick")) tags.push("Meme", "Classic");

    return {
      aiSummary: `AI analysis of "${video.title}". Categorized as ${tags.join(", ")}.`,
      aiTags: tags,
    };
  },

  /**
   * Intelligent sorting based on relevance to a set of tags or keywords.
   */
  sortByRelevance(videos: Video[], keywords: string[]): Video[] {
    const normalizedKeywords = keywords.map(k => k.toLowerCase());

    return [...videos].sort((a, b) => {
      const scoreA = this.calculateRelevance(a, normalizedKeywords);
      const scoreB = this.calculateRelevance(b, normalizedKeywords);
      return scoreB - scoreA; // Descending
    });
  },

  calculateRelevance(video: Video, keywords: string[]): number {
    let score = 0;
    const text = (video.title + " " + (video.aiSummary || "") + " " + (video.aiTags?.join(" ") || "")).toLowerCase();

    keywords.forEach(word => {
      if (text.includes(word)) score += 1;
      // Bonus for exact title matches
      if (video.title.toLowerCase().includes(word)) score += 2;
    });

    return score;
  }
};
