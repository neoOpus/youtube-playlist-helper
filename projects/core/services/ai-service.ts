import type { Video, Playlist } from "../types/model.js";

export const aiService = {
  async analyzeVideo(video: Video): Promise<Partial<Video>> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const tags = ["AI-Enhanced"];
    const title = (video.title || "").toLowerCase();

    if (title.includes("tutorial") || title.includes("how to")) tags.push("Educational");
    if (title.includes("review") || title.includes("unboxing")) tags.push("Analysis");
    if (title.includes("music") || title.includes("official video")) tags.push("Music");
    if (title.includes("rick") || title.includes("never gonna")) tags.push("Meme", "Classic");
    if (title.includes("news") || title.includes("update")) tags.push("Information");

    let vibe: Video['energyVibe'] = 'Productive';
    const vibes: Video['energyVibe'][] = ['Chill', 'Productive', 'Intense', 'Educational', 'Inspirational', 'Deep Focus'];

    if (title.includes("lofi") || title.includes("ambient")) vibe = 'Chill';
    else if (title.includes("workout") || title.includes("metal")) vibe = 'Intense';
    else if (title.includes("course") || title.includes("lesson")) vibe = 'Educational';
    else if (title.includes("motivation") || title.includes("success")) vibe = 'Inspirational';
    else if (title.includes("focus") || title.includes("coding")) vibe = 'Deep Focus';
    else vibe = vibes[title.length % vibes.length];

    const summaries = [
        `High-density node focused on ${tags.slice(1).join(", ") || "General"} content. Heuristic analysis suggests a ${vibe} state.`,
        `Neural fingerprint confirmed. This coordinate aligns with ${vibe} behavioral patterns and ${tags[1] || 'standard'} indexing.`,
        `Autonomous summary: Node "${video.title}" processed with ${vibe} resonance. Categorized under ${tags.join(" > ")}.`,
        `System Insight: Core content detected as ${tags[1] || 'Uncategorized'}. Estimated resonance intensity: High (${vibe}).`
    ];

    return {
      aiSummary: summaries[Math.floor(Math.random() * summaries.length)],
      aiTags: tags,
      energyVibe: vibe
    };
  },

  calculateVideoRelevance(video: Video, keywords: string[]): number {
    if (!video || !keywords.length) return 0;
    let score = 0;
    const title = (video.title || "").toLowerCase();
    const tags = video.aiTags || [];
    const lowerTags = tags.map((t) => t.toLowerCase());

    for (const k of keywords) {
      if (title.includes(k)) score += 10;
      for (const t of lowerTags) { if (t.includes(k)) { score += 15; break; } }
    }
    if (video.rating) score += video.rating * 5;
    return score;
  },

  calculatePlaylistRelevance(playlist: Playlist, keywords: string[]): number {
    if (!playlist || !keywords.length) return 0;
    let score = 0;
    const title = (playlist.title || "").toLowerCase();
    for (const k of keywords) { if (title.includes(k)) score += 20; }
    const videos = playlist.loadedVideos || [];
    if (videos.length > 0) {
      const videoScores = videos.map((v) => this.calculateVideoRelevance(v, keywords));
      score += videoScores.reduce((a, b) => a + b, 0) / videos.length;
    }
    return score;
  },

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
        if (expansion[lowerK]) expansion[lowerK].forEach(w => expanded.add(w));
    }
    return Array.from(expanded);
  },

  sortByRelevance(videos: Video[], keywords: string[]): Video[] {
    if (!keywords.length) return videos;
    const expanded = this.expandKeywords(keywords);
    return videos
      .map((v) => ({ video: v, score: this.calculateVideoRelevance(v, expanded) }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.video);
  },

  async summarizePlaylist(playlist: Playlist, videos: Video[]): Promise<string> {
    if (!videos.length) return "Empty infrastructure.";
    const topTags = new Map<string, number>();
    videos.forEach(v => (v.aiTags || []).forEach(t => topTags.set(t, (topTags.get(t) || 0) + 1)));
    const sorted = Array.from(topTags.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(t => t[0]);
    return `This collection of ${videos.length} nodes focuses on ${sorted.join(", ")}. Neural density is nominal.`;
  },

  sequenceOptimizer: {
    optimize(videos: Video[]) { return [...videos].sort((a, b) => (b.rating || 0) - (a.rating || 0)); }
  }
};
