import type { Video, Playlist } from "../../types/model";

class AIService {
  async suggestPlaylistTitle(videos: Video[]): Promise<string> {
    if (videos.length === 0) return "New Playlist";

    const channels = videos.map(v => v.channel).filter(Boolean);
    const commonChannel = this.getMostFrequent(channels);

    if (commonChannel) {
        return `Best of ${commonChannel}`;
    }

    return `Curated Collection (${videos.length} videos)`;
  }

  async categorizePlaylist(playlist: Playlist): Promise<string[]> {
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
        if (keys.some(k => title.includes(k))) {
            categories.add(cat);
        }
    });

    return Array.from(categories);
  }

  async generateVideoSummary(video: Video): Promise<string> {
      return `This video by ${video.channel} covers topics related to ${video.title.split(' ').slice(0, 3).join(', ')}.`;
  }

  async analyzeVideo(video: Video): Promise<Partial<Video>> {
      // Mocking AI analysis
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
