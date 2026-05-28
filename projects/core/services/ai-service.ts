import type { Video, Playlist, AISettings } from "../types/model.js";
import { storageService } from "./storage-service.js";

export interface AIProvider {
  analyzeVideo(video: Video, settings: AISettings): Promise<Partial<Video>>;
  summarizePlaylist(playlist: Playlist, videos: Video[], settings: AISettings): Promise<string>;
}

export const AI_PRESETS: Record<string, Partial<AISettings>> = {
    'openai-gpt-4o': { provider: 'openai', model: 'gpt-4o', baseUrl: 'https://api.openai.com/v1' },
    'openrouter-free': { provider: 'openrouter', model: 'meta-llama/llama-3-8b-instruct:free', baseUrl: 'https://openrouter.ai/api/v1' },
    'ollama-local': { provider: 'custom-openai-compatible', model: 'llama3', baseUrl: 'http://localhost:11434/v1' },
    'lm-studio': { provider: 'custom-openai-compatible', model: 'model-identifier', baseUrl: 'http://localhost:1234/v1' }
};

class LocalHeuristicsProvider implements AIProvider {
  async analyzeVideo(video: Video): Promise<Partial<Video>> {
    const tags = ["AI-Enhanced"];
    const title = (video.title || "").toLowerCase();
    if (title.includes("tutorial")) tags.push("Educational");
    if (title.includes("review")) tags.push("Analysis");
    if (title.includes("music")) tags.push("Music");
    if (title.includes("rick")) tags.push("Meme", "Classic");

    let vibe: Video['energyVibe'] = 'Productive';
    const vibes: Video['energyVibe'][] = ['Chill', 'Productive', 'Intense', 'Educational'];

    if (title.includes("lofi") || title.includes("ambient")) vibe = 'Chill';
    else if (title.includes("workout") || title.includes("metal")) vibe = 'Intense';
    else if (title.includes("course") || title.includes("lesson")) vibe = 'Educational';
    else {
        vibe = vibes[title.length % vibes.length];
    }

    return {
      aiSummary: `Automated neural summary: This node ("${video.title}") has been indexed with pro precision. It appears to focus on ${tags.join(", ")} content.`,
      aiTags: tags,
      energyVibe: vibe
    };
  }

  async summarizePlaylist(playlist: Playlist, videos: Video[]): Promise<string> {
    return `This is a collection of ${videos.length} videos focusing on "${playlist.title}". Neural density is high.`;
  }
}

class RemoteProvider implements AIProvider {
  async analyzeVideo(video: Video, settings: AISettings): Promise<Partial<Video>> {
    const requiresKey = !['local-heuristics', 'custom-openai-compatible'].includes(settings.provider);
    if (requiresKey && !settings.apiKey) {
        return new LocalHeuristicsProvider().analyzeVideo(video);
    }

    const baseUrl = settings.baseUrl || this.getDefaultBaseUrl(settings.provider);
    const model = settings.model || this.getDefaultModel(settings.provider);

    const prompt = `Analyze this video title and description. Return a JSON object with:
    - aiSummary: A short 1-sentence summary.
    - aiTags: An array of 3-5 relevant tags.
    - energyVibe: One of "Chill", "Productive", "Intense", "Educational".

    Video Title: ${video.title}
    Video Channel: ${video.channel}
    Video Notes: ${video.notes || 'None'}`;

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${settings.apiKey || 'not-required'}`,
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
                'Authorization': `Bearer ${settings.apiKey || 'not-required'}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5
            })
        });

        if (!response.ok) return "Neural density is high. Summary unavailable.";
        const data = await response.json();
        return data.choices[0].message.content;
    } catch {
        return "Neural density is high. Summary pending.";
    }
  }

  private getDefaultBaseUrl(provider: string): string {
      switch (provider) {
          case 'openrouter': return "https://openrouter.ai/api/v1";
          default: return "https://api.openai.com/v1";
      }
  }

  private getDefaultModel(provider: string): string {
      switch (provider) {
          case 'openrouter': return "meta-llama/llama-3-8b-instruct:free";
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
  async getSettings(): Promise<AISettings> {
    const settings = await storageService.getSettings();
    return settings.ai || {
        provider: 'local-heuristics',
        model: 'default',
        enabled: true
    };
  },

  async analyzeVideo(video: Video): Promise<Partial<Video>> {
    const settings = await this.getSettings();
    if (!settings.enabled) return {};

    const provider = providers[settings.provider] || providers['local-heuristics'];
    return provider.analyzeVideo(video, settings);
  },

  calculateVideoRelevance(video: Video, keywords: string[]): number {
    if (!video || !keywords.length) return 0;
    let score = 0;
    const title = (video.title || "").toLowerCase();
    const summary = (video.aiSummary || "").toLowerCase();
    const tags = video.aiTags || [];

    const lowerTags = tags.map((t) => t.toLowerCase());

    for (let i = 0; i < keywords.length; i++) {
      const k = keywords[i];
      if (title.includes(k)) score += 10;
      if (summary.includes(k)) score += 5;
      for (let j = 0; j < lowerTags.length; j++) {
        if (lowerTags[j].includes(k)) {
          score += 15;
          break;
        }
      }
    }
    if (video.rating) score += video.rating * 5;
    return score;
  },

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
      const videoScores = videos.map((v) =>
        this.calculateVideoRelevance(v, keywords)
      );
      score += videoScores.reduce((a, b) => a + b, 0) / videos.length;
    }
    return score;
  },

  async expandKeywords(keywords: string[]): Promise<string[]> {
    const settings = await this.getSettings();
    const baseExpansion: Record<string, string[]> = {
      coding: ["programming", "developer", "software", "tutorial", "code", "github"],
      music: ["song", "audio", "track", "concert", "live", "album"],
      tech: ["technology", "gadget", "review", "hardware", "software", "innovation"],
      gaming: ["gameplay", "walkthrough", "playthrough", "esports", "streaming"],
    };

    const expanded = new Set<string>();
    for (const k of keywords) {
      const lowerK = k.toLowerCase();
      expanded.add(lowerK);
      if (baseExpansion[lowerK]) {
        for (const expandedWord of baseExpansion[lowerK]) {
          expanded.add(expandedWord);
        }
      }
    }

    // Attempt AI expansion if remote provider is active
    if (settings.enabled && settings.provider !== 'local-heuristics' && settings.apiKey) {
        try {
            const baseUrl = settings.baseUrl || "https://api.openai.com/v1";
            const model = settings.model || "gpt-3.5-turbo";
            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${settings.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model,
                    messages: [{
                        role: "user",
                        content: `Given these keywords: "${keywords.join(', ')}", provide 10-15 additional highly related semantic keywords as a comma-separated list. Respond ONLY with the list.`
                    }],
                    temperature: 0.4
                })
            });

            if (response.ok) {
                const data = await response.json();
                const aiTerms = data.choices[0].message.content.split(',').map((t: string) => t.trim().toLowerCase());
                for (const term of aiTerms) expanded.add(term);
            }
        } catch (e) {
            console.warn("AI Keyword expansion failed:", e);
        }
    }

    return Array.from(expanded);
  },

  async sortByRelevance(videos: Video[], keywords: string[]): Promise<Video[]> {
    if (!keywords.length) return videos;
    const expandedAndNormalized = await this.expandKeywords(keywords);
    return videos
      .map((v) => ({
        video: v,
        score: this.calculateVideoRelevance(v, expandedAndNormalized),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.video);
  },

  async summarizePlaylist(playlist: Playlist, videos: Video[]): Promise<string> {
    const settings = await this.getSettings();
    const provider = providers[settings.provider] || providers['local-heuristics'];
    return provider.summarizePlaylist(playlist, videos, settings);
  },

  sequenceOptimizer: {
    optimize(videos: Video[]) {
      return [...videos].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    },
  },
};
