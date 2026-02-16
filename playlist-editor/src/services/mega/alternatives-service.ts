export const alternativesService = {
  getSearchUrls(title: string, videoId: string) {
    const encodedTitle = encodeURIComponent(title);
    const encodedId = encodeURIComponent(videoId);

    return [
      {
        name: "Wayback Machine",
        url: `https://web.archive.org/web/*/https://www.youtube.com/watch?v=${encodedId}`,
        icon: "faHistory",
        domain: "archive.org"
      },
      {
        name: "GhostArchive",
        url: `https://ghostarchive.org/vsearch/${encodedId}`,
        icon: "faGhost",
        domain: "ghostarchive.org"
      },
      {
        name: "Odysee",
        url: `https://odysee.com/$/search?q=${encodedTitle}`,
        icon: "faVideo",
        domain: "odysee.com"
      },
      {
        name: "Internet Archive",
        url: `https://archive.org/details/movies?query=${encodedTitle}`,
        icon: "faArchive",
        domain: "archive.org"
      }
    ];
  },

  async checkVideoAvailability(videoId: string): Promise<{ available: boolean, reason?: string }> {
      // Logic to check if video is actually deleted
      // In a real extension, we might use the YouTube API or a HEAD request to the thumbnail/page
      // Mock: randomly flag some as deleted for demonstration
      if (videoId.length % 7 === 0) {
          return { available: false, reason: "Deleted or Private" };
      }
      return { available: true };
  }
};
