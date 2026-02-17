import { storage } from '../core/storage-service';
import type { Video, Playlist } from "../../types/model";

export interface AIAgent {
    id: string;
    name: string;
    description: string;
    role: 'categorizer' | 'summarizer' | 'auditor' | 'reorderer' | 'coder';
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
              id: 'agent-watchdog-1',
              name: 'Deleted Video Watchdog',
              description: 'Periodically checks for videos that may have been deleted or privated.',
              role: 'auditor',
              execute: async ({ videos }) => {
                  const issues = [];
                  for (const v of videos) {
                      if (!v.title || v.title.includes('Deleted video')) {
                          issues.push({ videoId: v.videoId, status: 'missing' });
                      }
                  }
                  return issues;
              }
          },
          {
              id: 'agent-coder-1',
              name: 'Action Architect',
              description: 'Generates custom action handlers from natural language prompts.',
              role: 'coder',
              execute: async ({ prompt }) => {
                  console.log(`Architecting action for: ${prompt}`);
                  // Simulation of AI code generation
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

  async suggestPlaylistTitle(videos: Video[]): Promise<string> {
    if (videos.length === 0) return "New Playlist";
    const channels = videos.map(v => v.channel).filter(Boolean);
    const commonChannel = this.getMostFrequent(channels);
    return commonChannel ? `Best of ${commonChannel}` : `Curated Collection (${videos.length} videos)`;
  }

  async categorizePlaylist(playlist: Playlist): Promise<string[]> {
      return await this.runAgent('categorizer', { playlist });
  }

  async analyzeVideo(video: Video): Promise<Partial<Video>> {
      return {
          aiSummary: `Deep dive into ${video.title}. An expert perspective from ${video.channel}.`,
          aiTags: ['Education', 'Insightful', 'Verified']
      };
  }

  private getMostFrequent(arr: string[]) {
    if (arr.length === 0) return null;
    const map = new Map();
    arr.forEach(x => map.set(x, (map.get(x) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }
}

export const aiService = new AIService();
