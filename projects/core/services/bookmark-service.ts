import { videoService } from "./video-service.js";

export interface YouTubeBookmarks {
  folderName: string;
  videoIds: string[];
}

export const bookmarkService = {
  /**
   * Retrieves all YouTube bookmarks grouped by folder.
   */
  async getYoutubeFolderBookmarks(): Promise<YouTubeBookmarks[]> {
    if (typeof chrome === "undefined" || !chrome.bookmarks) return [];
    const tree = await chrome.bookmarks.getTree();
    return this.recursiveCollectBookmarks("", tree);
  },

  /**
   * Internal recursive helper for bookmark collection.
   */
  recursiveCollectBookmarks(parentFolder: string, tree: chrome.bookmarks.BookmarkTreeNode[]): YouTubeBookmarks[] {
    let bookmarks: YouTubeBookmarks[] = [];
    if (!tree) return bookmarks;

    let currentBookmarks: YouTubeBookmarks | null = null;

    tree.forEach((node) => {
      // Skip separators if they exist (though not in V3 types usually)
      if ((node as any).type === "separator") return;

      if (node.children && node.children.length > 0) {
        bookmarks.push(
          ...this.recursiveCollectBookmarks(
            parentFolder + node.title + "/",
            node.children
          )
        );
      } else {
        if (!node.url) return;
        const videoId = videoService.parseYoutubeId(node.url);
        if (videoId) {
          if (!currentBookmarks) {
            currentBookmarks = {
              folderName: parentFolder,
              videoIds: [videoId],
            };
          } else {
            currentBookmarks.videoIds.push(videoId);
          }
        }
      }
    });

    if (currentBookmarks) {
      bookmarks.unshift(currentBookmarks);
    }
    return bookmarks;
  }
};
