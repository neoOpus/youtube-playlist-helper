import type { Video, Playlist } from "../../types/model";

export interface AIAgent {
    id: string;
    name: string;
    description: string;
    role: 'categorizer' | 'summarizer' | 'auditor' | 'reorderer' | 'coder' | 'watchdog' | 'clickbait_guard';
    execute: (context: any) => Promise<any>;
}

class AIService {
  private agents: AIAgent[] = [];

  constructor() {
      this.registerDefaultAgents();
  }

  private registerDefaultAgents() {
      this.agents = [
          {
              id: 'agent-categorizer-1',
              name: 'Heuristic Categorizer',
              description: 'Uses smart heuristics to assign categories based on titles and metadata.',
              role: 'categorizer',
              execute: async ({ playlist }) => {
                  const categories = new Set<string>();
                  const keywords = {
                      'Music': ['music', 'official video', 'lyrics', 'song', 'live'],
                      'Education': ['tutorial', 'how to', 'lesson', 'course', 'education', 'lecture'],
                      'Gaming': ['gameplay', 'walkthrough', 'gaming', 'review', 'nintendo', 'playstation', 'xbox'],
                      'Tech': ['unboxing', 'tech', 'review', 'iphone', 'android', 'software', 'programming'],
                      'News': ['news', 'report', 'politics', 'current events']
                  };
                  const title = playlist.title.toLowerCase();
                  Object.entries(keywords).forEach(([cat, keys]) => {
                      if (keys.some(k => title.includes(k))) categories.add(cat);
                  });
                  return Array.from(categories);
              }
          },
          {
              id: 'agent-summarizer-1',
              name: 'Key Insight Summarizer',
              description: 'Generates one-sentence summaries and key learnings.',
              role: 'summarizer',
              execute: async ({ video }) => {
                  // Simulation of summarizing logic
                  const learnings = [
                      "Historical context of the subject.",
                      "Technical implementation details.",
                      "Critical analysis of common misconceptions."
                  ];
                  return {
                      summary: `A comprehensive overview of ${video.title} by ${video.channel}.`,
                      keyLearnings: learnings.slice(0, Math.floor(Math.random() * 3) + 1)
                  };
              }
          },
          {
              id: 'agent-clickbait-1',
              name: 'AI Clickbait Guard',
              description: 'Flags deceptive or sensationalized titles.',
              role: 'clickbait_guard',
              execute: async ({ video }) => {
                  const clickbaitWords = ['OMG', 'SHOCKING', 'GONE WRONG', '!', 'MUST WATCH', 'NEVER SEEN', 'SECRET'];
                  const uppercaseRatio = (video.title.match(/[A-Z]/g) || []).length / video.title.length;
                  const hasKeywords = clickbaitWords.some(w => video.title.toUpperCase().includes(w));

                  return {
                      isClickbait: uppercaseRatio > 0.5 || hasKeywords,
                      confidence: Math.round((uppercaseRatio + (hasKeywords ? 0.5 : 0)) * 100)
                  };
              }
          },
          {
              id: 'agent-mirror-1',
              name: 'Mirror Watchdog',
              description: 'Finds alternative platform mirrors for the video.',
              role: 'watchdog',
              execute: async ({ video }) => {
                  // Integration with alternativesService would happen here
                  return [
                      { platform: 'Odysee', url: `https://odysee.com/search?q=${encodeURIComponent(video.title)}` },
                      { platform: 'Bitchute', url: `https://bitchute.com/search?q=${encodeURIComponent(video.title)}` }
                  ];
              }
          },
          {
              id: 'agent-coder-1',
              name: 'Action Architect',
              description: 'Generates custom action handlers from natural language prompts.',
              role: 'coder',
              execute: async ({ prompt }) => {
                  console.log(`Architecting action for: ${prompt}`);
                  if (prompt.toLowerCase().includes('notion')) {
                      return "console.log('Exporting to Notion...', context.videos); window.success('Data sent to Notion mock API');";
                  }
                  if (prompt.toLowerCase().includes('clean')) {
                      return "const clean = context.videos.filter(v => !v.title.includes('DELETED')); context.playlist.videos = clean.map(v => v.videoId); await storage.savePlaylist(context.playlist); await context.refresh();";
                  }
                  return "console.log('Custom Action Executed', context);";
              }
          }
      ];
  }

  async runAgent(role: string, context: any) {
      const agent = this.agents.find(a => a.role === role);
      if (agent) {
          console.log(`Running AI Agent: ${agent.name}`);
          return await agent.execute(context);
      }
      throw new Error(`No agent found for role: ${role}`);
  }

  async generateActionHandler(prompt: string): Promise<string> {
      return await this.runAgent('coder', { prompt });
  }

  async analyzeVideo(video: Video) {
      const summaryData = await this.runAgent('summarizer', { video });
      const clickbaitData = await this.runAgent('clickbait_guard', { video });
      const mirrors = await this.runAgent('watchdog', { video });

      return {
          aiSummary: summaryData.summary,
          aiKeyLearnings: summaryData.keyLearnings,
          isClickbait: clickbaitData.isClickbait,
          mirrors
      };
  }

  async suggestPlaylistTitle(videos: Video[]): Promise<string> {
    if (videos.length === 0) return "New Playlist";
    const channels = videos.map(v => v.channel).filter(Boolean);
    const commonChannel = this.getMostFrequent(channels);
    return commonChannel ? `Best of ${commonChannel}` : `Curated Collection (${videos.length} videos)`;
  }

  async categorizePlaylist(playlist: Playlist): Promise<string[]> {
      return await this.runAgent('categorizer', { playlist });
  }

  private getMostFrequent(arr: string[]) {
    if (arr.length === 0) return null;
    const map = new Map();
    arr.forEach(x => map.set(x, (map.get(x) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }
}

export const aiService = new AIService();
