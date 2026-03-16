import type { Video, Playlist } from "../types/model";

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
      const scoreA = this.calculateVideoRelevance(a, normalizedKeywords);
      const scoreB = this.calculateVideoRelevance(b, normalizedKeywords);
      return scoreB - scoreA; // Descending
    });
  },

  /**
   * Calculates a relevance score for a video based on keywords.
   */
  calculateVideoRelevance(video: Video, keywords: string[]): number {
    let score = 0;
    const lowerTitle = video.title.toLowerCase();
    const text = (lowerTitle + " " + (video.aiSummary?.toLowerCase() || "") + " " + (video.aiTags?.join(" ").toLowerCase() || ""));

    for (const word of keywords) {
      const lowerWord = word.toLowerCase();
      if (text.includes(lowerWord)) score += 1;
      // Bonus for exact title matches
      if (lowerTitle.includes(lowerWord)) score += 2;
    }

    return score;
  },

  /**
   * Calculates a relevance score for a playlist based on keywords.
   */
  calculatePlaylistRelevance(playlist: Playlist, keywords: string[]): number {
      let score = 0;
      const lowerTitle = playlist.title.toLowerCase();
      const text = (lowerTitle + " " + (playlist.groups?.join(" ").toLowerCase() || ""));

      for (const word of keywords) {
          const lowerWord = word.toLowerCase();
          if (text.includes(lowerWord)) score += 1;
          if (lowerTitle.includes(lowerWord)) score += 2;
      }

      return score;
  }
};
