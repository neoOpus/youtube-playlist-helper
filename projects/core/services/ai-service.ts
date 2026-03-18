import type { Video, Playlist } from "../types/model.js";

/**
 * AI Service for intelligent playlist analysis and optimization.
 * Part of the "Quantum Edition" upgrade.
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
    /**
     * Calculates relevance score for a video based on keywords.
     * Uses a multi-signal approach (Title, AI Tags, Rating).
     */
    calculateVideoRelevance(video: Video, keywords: string[]): number {
        if (!video) return 0;
        let score = 0;
        const title = (video.title || "").toLowerCase();

        keywords.forEach(k => {
            if (title.includes(k.toLowerCase())) score += 10;
        });

        if (video.aiTags) {
            video.aiTags.forEach(tag => {
                if (keywords.some(k => tag.toLowerCase().includes(k.toLowerCase()))) {
                    score += 15;
                }
            });
        }

        if (video.rating) score += video.rating * 5;

        return score;
    },

    /**
     * Expands a set of keywords using semantic associations.
     */
    expandKeywords(keywords: string[]): string[] {
        const expansion: Record<string, string[]> = {
            "coding": ["programming", "developer", "software", "tutorial", "code", "github"],
            "music": ["song", "audio", "track", "concert", "live", "album"],
            "tech": ["technology", "gadget", "review", "hardware", "software", "innovation"],
            "gaming": ["gameplay", "walkthrough", "playthrough", "esports", "streaming"]
        };

        const expanded = [...keywords];
        keywords.forEach(k => {
            const lowerK = k.toLowerCase();
            if (expansion[lowerK]) {
                expanded.push(...expansion[lowerK]);
            }
        });
        return [...new Set(expanded)];
    },

    /**
     * Sorts videos by relevance using a Schwartzian transform for performance.
     */
    sortByRelevance(videos: Video[], keywords: string[]): Video[] {
        if (!keywords.length) return videos;
        const expanded = this.expandKeywords(keywords);

        // Schwartzian Transform
        return videos
            .map(v => ({ video: v, score: this.calculateVideoRelevance(v, expanded) }))
            .sort((a, b) => b.score - a.score)
            .map(item => item.video);
    },

    /**
     * Aggregates relevance for an entire playlist.
     */
    calculatePlaylistRelevance(playlist: Playlist, keywords: string[]): number {
        let score = 0;
        const title = (playlist.title || "").toLowerCase();
        keywords.forEach(k => { if (title.includes(k.toLowerCase())) score += 20; });

        const videos = playlist.loadedVideos || [];
        if (videos.length > 0) {
            const videoScores = videos.map(v => this.calculateVideoRelevance(v, keywords));
            score += videoScores.reduce((a, b) => a + b, 0) / videos.length;
        }
        return score;
    },

    /**
     * Performs a "Neural Scan" on a video to generate summaries and tags.
     * Note: In a production environment, this would call an LLM API.
     */
    async analyzeVideo(video: Video): Promise<Partial<Video>> {
        // Simulated AI analysis latency
        await new Promise(r => setTimeout(r, 800));

        const tags = ["AI-Enhanced"];
        if (video.title.toLowerCase().includes("tutorial")) tags.push("Educational");
        if (video.title.toLowerCase().includes("review")) tags.push("Analysis");

        return {
            aiSummary: `Automated neural summary: This node ("${video.title}") has been indexed with quantum precision. It appears to focus on ${tags.join(", ")} content.`,
            aiTags: tags
        };
    },

    async summarizePlaylist(playlist: Playlist, videos: Video[]): Promise<string> {
        return `This is a collection of ${videos.length} videos focusing on "${playlist.title}". Neural density is high.`;
    },

    sequenceOptimizer: {
        /**
         * Optimizes video sequence based on rating and relevance signals.
         */
        optimize(videos: Video[]) {
            return [...videos].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
    }
};
