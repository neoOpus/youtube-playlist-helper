export const alternativesService = {
  getSearchUrls(title: string, videoId: string) {
    const encodedTitle = encodeURIComponent(title);
    return [
      {
        name: "Wayback Machine",
        url: `https://web.archive.org/web/*/https://www.youtube.com/watch?v=${videoId}`,
      },
      {
        name: "Google Search (Title)",
        url: `https://www.google.com/search?q=${encodedTitle}`,
      },
      {
        name: "YouTube Search (Title)",
        url: `https://www.youtube.com/results?search_query=${encodedTitle}`,
      },
      {
          name: "DuckDuckGo Video Search",
          url: `https://duckduckgo.com/?q=${encodedTitle}&iax=videos&ia=videos`
      }
    ];
  },

  async isVideoUnavailable(videoId: string): Promise<boolean> {
    // Basic check: if noembed fails to return a title, it might be unavailable
    try {
        const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        const json = await res.json();
        return !!json.error;
    } catch (e) {
        return true;
    }
  }
};
