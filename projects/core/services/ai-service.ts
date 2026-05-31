import type { Video, Playlist, AISettings } from "../types/model.js";
import { storageService } from "./storage-service.js";

export interface AIProvider {
  analyzeVideo(video: Video, settings: AISettings): Promise<Partial<Video>>;
  summarizePlaylist(playlist: Playlist, videos: Video[], settings: AISettings): Promise<string>;
}

/**
 * Local Heuristics Provider: No external API calls, uses regex and keywords.
 * Fallback and "Free Tier" default.
 */
class LocalHeuristicsProvider implements AIProvider {
  async analyzeVideo(video: Video): Promise<Partial<Video>> {
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
  }

  async summarizePlaylist(playlist: Playlist, videos: Video[]): Promise<string> {
    if (!videos.length) return "Empty infrastructure.";
    const topTags = new Map<string, number>();
    videos.forEach(v => (v.aiTags || []).forEach(t => topTags.set(t, (topTags.get(t) || 0) + 1)));
    const sorted = Array.from(topTags.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(t => t[0]);
    return `This collection of ${videos.length} nodes focuses on ${sorted.join(", ")}. Neural density is nominal.`;
  }
}

/**
 * Remote Provider: Supports OpenAI-compatible endpoints.
 */
class RemoteProvider implements AIProvider {
  async analyzeVideo(video: Video, settings: AISettings): Promise<Partial<Video>> {
    if (!settings.apiKey && settings.provider !== 'local-heuristics') {
        return new LocalHeuristicsProvider().analyzeVideo(video);
    }

    const baseUrl = settings.baseUrl || this.getDefaultBaseUrl(settings.provider);
    const model = settings.model || this.getDefaultModel(settings.provider);

    const prompt = `Analyze this video title and description. Return a JSON object with:
    - aiSummary: A short 1-sentence summary.
    - aiTags: An array of 3-5 relevant tags.
    - energyVibe: One of "Chill", "Productive", "Intense", "Educational", "Inspirational", "Deep Focus".

    Video Title: ${video.title}
    Video Channel: ${video.channel}
    Video Notes: ${video.notes || 'None'}`;

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${settings.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: "You are a helpful AI that analyzes video content. Always return valid JSON." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: settings.temperature ?? 0.7
            })
        });

        if (!response.ok) throw new Error(`AI Provider Error: ${response.statusText}`);

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);

        return {
            aiSummary: content.aiSummary,
            aiTags: content.aiTags,
            energyVibe: content.energyVibe
        };
    } catch (error) {
        console.error("Remote AI analysis failed, falling back to local:", error);
        return new LocalHeuristicsProvider().analyzeVideo(video);
    }
  }

  async summarizePlaylist(playlist: Playlist, videos: Video[], settings: AISettings): Promise<string> {
    const baseUrl = settings.baseUrl || this.getDefaultBaseUrl(settings.provider);
    const model = settings.model || this.getDefaultModel(settings.provider);

    const prompt = `Summarize this playlist titled "${playlist.title}" which contains ${videos.length} videos.
    Provide a cohesive summary of the overall theme and learning goals.`;

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${settings.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5
            })
        });

        if (!response.ok) return new LocalHeuristicsProvider().summarizePlaylist(playlist, videos);
        const data = await response.json();
        return data.choices[0].message.content;
    } catch {
        return new LocalHeuristicsProvider().summarizePlaylist(playlist, videos);
    }
  }

  private getDefaultBaseUrl(provider: string): string {
      switch (provider) {
          case 'openrouter': return "https://openrouter.ai/api/v1";
          case 'anthropic': return "https://api.anthropic.com/v1";
          default: return "https://api.openai.com/v1";
      }
  }

  private getDefaultModel(provider: string): string {
      switch (provider) {
          case 'openrouter': return "meta-llama/llama-3-8b-instruct:free";
          case 'openai': return "gpt-3.5-turbo";
          default: return "gpt-3.5-turbo";
      }
  }
}

const providers: Record<string, AIProvider> = {
    'local-heuristics': new LocalHeuristicsProvider(),
    'openai': new RemoteProvider(),
    'openrouter': new RemoteProvider(),
    'anthropic': new RemoteProvider(),
    'custom-openai-compatible': new RemoteProvider()
};

export const aiService = {
  async analyzeVideo(video: Video): Promise<Partial<Video>> {
    const allSettings = await storageService.getSettings();
    const settings = allSettings.ai;
    if (!settings?.enabled) return {};

    const provider = providers[settings.provider] || providers['local-heuristics'];
    return provider.analyzeVideo(video, settings);
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
    const allSettings = await storageService.getSettings();
    const settings = allSettings.ai;
    if (!settings?.enabled) return "Neural density is nominal.";

    const provider = providers[settings.provider] || providers['local-heuristics'];
    return provider.summarizePlaylist(playlist, videos, settings);
  },

  sequenceOptimizer: {
    optimize(videos: Video[]) { return [...videos].sort((a, b) => (b.rating || 0) - (a.rating || 0)); }
  }
};
