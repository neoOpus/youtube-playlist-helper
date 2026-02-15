export const alternativesService = {
  getSearchUrls(title: string, videoId: string) {
    const encodedTitle = encodeURIComponent(title);
    const encodedId = encodeURIComponent(videoId);

    return [
      {
        name: "Wayback Machine",
        url: `https://web.archive.org/web/*/https://www.youtube.com/watch?v=${encodedId}`,
        icon: "faHistory"
      },
      {
        name: "GhostArchive",
        url: `https://ghostarchive.org/vsearch/${encodedId}`,
        icon: "faGhost"
      },
      {
        name: "Odysee",
        url: `https://odysee.com/$/search?q=${encodedTitle}`,
        icon: "faVideo"
      },
      {
        name: "Bitchute",
        url: `https://www.bitchute.com/search/?q=${encodedTitle}&sort=relevance`,
        icon: "faSearch"
      },
      {
        name: "Internet Archive (Video)",
        url: `https://archive.org/details/movies?query=${encodedTitle}`,
        icon: "faArchive"
      }
    ];
  },

  async findSimilarVideos(videoTitle: string) {
      // Logic to find similar videos on YouTube or other platforms
      // In a real app, this might use a vector database or search API
      return [];
  }
};
