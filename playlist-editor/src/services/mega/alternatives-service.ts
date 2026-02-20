import { faHistory, faGhost, faVideo, faArchive, faSearchPlus } from "@fortawesome/free-solid-svg-icons";

export const alternativesService = {
  getSearchUrls(title: string, videoId: string) {
    const encodedTitle = encodeURIComponent(title);
    const encodedId = encodeURIComponent(videoId);

    return [
      {
        name: "Wayback Machine",
        url: `https://web.archive.org/web/*/https://www.youtube.com/watch?v=${encodedId}`,
        icon: faHistory,
        domain: "archive.org"
      },
      {
        name: "GhostArchive",
        url: `https://ghostarchive.org/vsearch/${encodedId}`,
        icon: faGhost,
        domain: "ghostarchive.org"
      },
      {
        name: "Invidious",
        url: `https://yewtu.be/watch?v=${encodedId}`,
        icon: faVideo,
        domain: "yewtu.be"
      },
      {
        name: "Odysee",
        url: `https://odysee.com/$/search?q=${encodedTitle}`,
        icon: faVideo,
        domain: "odysee.com"
      },
      {
        name: "Internet Archive",
        url: `https://archive.org/details/movies?query=${encodedTitle}`,
        icon: faArchive,
        domain: "archive.org"
      }
    ];
  },

  async checkVideoAvailability(videoId: string): Promise<{ available: boolean, reason?: string, alternativeUrl?: string }> {
      // Invidious instances offer a great way to check if a video is truly gone or just geo-blocked/private
      try {
          const res = await fetch(`https://invidious.snopyta.org/api/v1/videos/${videoId}?fields=videoId,title,description`);
          if (res.ok) return { available: true };

          // If 404 on Invidious, it's likely gone from YT too
          if (res.status === 404) {
              return {
                  available: false,
                  reason: "Deleted from YouTube",
                  alternativeUrl: `https://web.archive.org/web/*/https://www.youtube.com/watch?v=${videoId}`
              };
          }
      } catch (e) {
          // Fallback to local heuristic
          if (videoId.length % 11 === 0) return { available: false, reason: "Potentially Unavailable" };
      }
      return { available: true };
  }
};
