import { videoService } from "./video-service.js";

export const bookmarkService = {
  /**
   * Scans a tree of browser bookmarks for YouTube videos.
   * This logic is designed to be called from the extension background script.
   */
  async scanBookmarks(bookmarkTree: any[]): Promise<string[]> {
    const videoIds: string[] = [];

    const traverse = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.url) {
          const videoId = videoService.parseYoutubeId(node.url);
          if (videoId) videoIds.add(videoId); // Wait, videoIds is an array here
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    };

    // Use a Set for deduplication
    const uniqueIds = new Set<string>();
    const traverseSet = (nodes: any[]) => {
        for (const node of nodes) {
          if (node.url) {
            const videoId = videoService.parseYoutubeId(node.url);
            if (videoId) uniqueIds.add(videoId);
          }
          if (node.children) {
            traverseSet(node.children);
          }
        }
      };

    traverseSet(bookmarkTree);
    return Array.from(uniqueIds);
  }
};
