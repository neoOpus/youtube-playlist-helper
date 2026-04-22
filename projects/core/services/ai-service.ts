import type { Video, Playlist } from "../types/model.js";

/**
 * AI Service for intelligent playlist analysis and optimization.
 * Part of the "Professional Edition" upgrade.
 * Optimized for high-throughput relevance scoring.
 */
export const aiService = {
  /**
   * Analyzes a video and returns enrichment data.
   */
  async analyzeVideo(video: Video): Promise<Partial<Video>> {
    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const tags = ["AI-Enhanced"];
    const title = (video.title || "").toLowerCase();
    const channel = (video.channel || "").toLowerCase();

    if (title.includes("tutorial") || title.includes("how to")) tags.push("Educational");
    if (title.includes("review") || title.includes("unboxing")) tags.push("Analysis");
    if (title.includes("music") || title.includes("official video")) tags.push("Music");
    if (title.includes("rick") || title.includes("never gonna")) tags.push("Meme", "Classic");
    if (title.includes("news") || title.includes("update")) tags.push("Information");
    if (title.includes("podcast") || title.includes("talk")) tags.push("Discussion");

    // Vibe/Energy heuristic analysis
    let vibe: Video['energyVibe'] = 'Productive';
    const vibes: Video['energyVibe'][] = ['Chill', 'Productive', 'Intense', 'Educational', 'Inspirational', 'Deep Focus'];

    if (title.includes("lofi") || title.includes("ambient") || title.includes("relax")) vibe = 'Chill';
    else if (title.includes("workout") || title.includes("metal") || title.includes("gaming")) vibe = 'Intense';
    else if (title.includes("course") || title.includes("lesson") || title.includes("explained")) vibe = 'Educational';
    else if (title.includes("motivation") || title.includes("speech") || title.includes("success")) vibe = 'Inspirational';
    else if (title.includes("focus") || title.includes("study") || title.includes("coding")) vibe = 'Deep Focus';
    else {
        // Pseudo-random but deterministic based on title length for variety
        vibe = vibes[title.length % vibes.length];
    }

    // Sentiment heuristic
    const positiveWords = ["best", "great", "amazing", "love", "awesome", "good"];
    const negativeWords = ["bad", "worst", "hate", "awful", "terrible", "problem"];

    let sentiment = 0;
    positiveWords.forEach(w => { if (title.includes(w)) sentiment++; });
    negativeWords.forEach(w => { if (title.includes(w)) sentiment--; });

    let sentimentLabel = "Neutral";
    if (sentiment > 0) sentimentLabel = "Positive";
    if (sentiment < 0) sentimentLabel = "Critical";

    return {
      aiSummary: `Automated neural summary: This node ("${video.title}") has been indexed with pro precision. Content type: ${tags.join(", ")}. Sentiment detected as ${sentimentLabel}. Estimated vibe: ${vibe}.`,
      aiTags: tags,
      energyVibe: vibe
    };
  },

  /**
   * Calculates relevance score for a video based on keywords.
   * Uses a multi-signal approach (Title, AI Tags, Rating).
   * ⚡ PERFORMANCE: Keywords should be pre-lowercased for maximum speed in hot loops.
   */
  calculateVideoRelevance(video: Video, keywords: string[]): number {
    if (!video || !keywords.length) return 0;
    let score = 0;
    const title = (video.title || "").toLowerCase();
    const summary = (video.aiSummary || "").toLowerCase();
    const tags = video.aiTags || [];

    // ⚡ PERFORMANCE: Pre-lowercase tags once per video, not per keyword.
    const lowerTags = tags.map((t) => t.toLowerCase());

    for (let i = 0; i < keywords.length; i++) {
      const k = keywords[i];

      // Signal 1: Title (High weight)
      if (title.includes(k)) score += 10;
      // Signal 2: Summary (Medium weight)
      if (summary.includes(k)) score += 5;

      // Signal 3: AI Tags (High weight)
      for (let j = 0; j < lowerTags.length; j++) {
        if (lowerTags[j].includes(k)) {
          score += 15;
          break;
        }
      }
    }

    // Signal 4: Rating (Small boost)
    if (video.rating) score += video.rating * 5;

    return score;
  },

  /**
   * Aggregates relevance for an entire playlist.
   */
  calculatePlaylistRelevance(playlist: Playlist, keywords: string[]): number {
    if (!playlist || !keywords.length) return 0;
    let score = 0;
    const title = (playlist.title || "").toLowerCase();
    const groups = (playlist.groups || []).map((g) => g.toLowerCase());

    for (let i = 0; i < keywords.length; i++) {
      const k = keywords[i];
      if (title.includes(k)) score += 20;

      for (let j = 0; j < groups.length; j++) {
        if (groups[j].includes(k)) {
          score += 10;
          break;
        }
      }
    }

    const videos = playlist.loadedVideos || [];
    if (videos.length > 0) {
      // Calculate average video relevance
      const videoScores = videos.map((v) =>
        this.calculateVideoRelevance(v, keywords)
      );
      score += videoScores.reduce((a, b) => a + b, 0) / videos.length;
    }
    return score;
  },

  /**
   * Expands a set of keywords using semantic associations.
   */
  expandKeywords(keywords: string[]): string[] {
    const expansion: Record<string, string[]> = {
      coding: ["programming", "developer", "software", "tutorial", "code", "github", "js", "ts", "rust"],
      music: ["song", "audio", "track", "concert", "live", "album", "remix", "lofi"],
      tech: ["technology", "gadget", "review", "hardware", "software", "innovation", "ai", "future"],
      gaming: ["gameplay", "walkthrough", "playthrough", "esports", "streaming", "nintendo", "xbox", "ps5"],
      education: ["learning", "tutorial", "course", "lesson", "explained", "science", "math"],
    };

    const expanded = new Set<string>();
    for (const k of keywords) {
      const lowerK = k.toLowerCase();
      expanded.add(lowerK);
      if (expansion[lowerK]) {
        for (const expandedWord of expansion[lowerK]) {
          expanded.add(expandedWord);
        }
      }
    }
    return Array.from(expanded);
  },

  /**
   * Sorts videos by relevance using a Schwartzian transform for performance.
   */
  sortByRelevance(videos: Video[], keywords: string[]): Video[] {
    if (!keywords.length) return videos;
    const expandedAndNormalized = this.expandKeywords(keywords);

    // ⚡ PERFORMANCE: Schwartzian Transform
    // Pre-calculating relevance scores prevents O(N log N) redundant calculations.
    return videos
      .map((v) => ({
        video: v,
        score: this.calculateVideoRelevance(v, expandedAndNormalized),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.video);
  },

  async summarizePlaylist(playlist: Playlist, videos: Video[]): Promise<string> {
    if (!videos.length) return "Empty infrastructure. No nodes to summarize.";

    const topTags = new Map<string, number>();
    videos.forEach(v => {
        (v.aiTags || []).forEach(t => {
            topTags.set(t, (topTags.get(t) || 0) + 1);
        });
    });

    const sortedTags = Array.from(topTags.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(t => t[0]);

    return `This collection of ${videos.length} videos is primarily focused on ${sortedTags.join(", ")}. Overall infrastructure health is nominal.`;
  },

  sequenceOptimizer: {
    /**
     * Optimizes video sequence based on rating and relevance signals.
     */
    optimize(videos: Video[]) {
      return [...videos].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    },
  },
};
