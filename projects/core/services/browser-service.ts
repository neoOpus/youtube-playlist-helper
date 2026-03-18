/**
 * Service for interacting with browser APIs (Tabs, Bookmarks, Scripting).
 * Designed for Manifest V3.
 */
export const browserService = {
  /**
   * Retrieves the active tab in the current window.
   */
  async getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
    if (typeof chrome === "undefined" || !chrome.tabs) return undefined;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  },

  /**
   * Retrieves all YouTube tabs in the current window.
   */
  async getYoutubeTabs(includePlaylists = true): Promise<chrome.tabs.Tab[]> {
    if (typeof chrome === "undefined" || !chrome.tabs) return [];
    const tabs = await chrome.tabs.query({ currentWindow: true });
    return tabs.filter(tab => {
        const url = tab.url || "";
        const isYoutube = url.includes("youtube.com/watch") || url.includes("youtube.com/playlist");
        if (!isYoutube) return false;
        if (!includePlaylists && url.includes("list=")) return false;
        return true;
    });
  },

  /**
   * Executes a script file in a specific tab.
   */
  async executeScript(tabId: number, file: string): Promise<any> {
    if (typeof chrome === "undefined" || !chrome.scripting) return undefined;
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      files: [file],
    });
    return result[0]?.result;
  },

  /**
   * Scans the current tab for YouTube links and thumbnails.
   */
  async scanCurrentTabForVideos(): Promise<string[]> {
    if (typeof chrome === "undefined" || !chrome.scripting) return [];
    const tab = await this.getActiveTab();
    if (!tab?.id) return [];

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const html = document.body.innerHTML;
        const youtubeRegex = /(?:v=|shorts\/|live\/|embed\/|v\/|youtu\.be\/|\/v\/|watch\?v=)([a-zA-Z0-9_-]{11})/g;
        const thumbnailRegex = /(?:img\.youtube|i\.ytimg|i1\.ytimg)\.com\/vi\/([a-zA-Z0-9_-]{11})/g;

        const ids = new Set<string>();
        let match;
        while ((match = youtubeRegex.exec(html))) ids.add(match[1]);
        while ((match = thumbnailRegex.exec(html))) ids.add(match[1]);

        return Array.from(ids);
      }
    });
    return result[0]?.result || [];
  },

  /**
   * Closes a list of tabs.
   */
  async closeTabs(tabIds: number[]): Promise<void> {
    if (typeof chrome === "undefined" || !chrome.tabs) return;
    await chrome.tabs.remove(tabIds);
  },

  /**
   * Creates a new tab with the specified URL.
   */
  async createTab(url: string): Promise<chrome.tabs.Tab> {
    if (typeof chrome === "undefined" || !chrome.tabs) throw new Error("Browser API not available");
    return await chrome.tabs.create({ url });
  }
};
