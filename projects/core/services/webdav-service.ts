import { storageService } from "./storage-service";

/**
 * Service for WebDAV synchronization.
 * Enhanced with robustness and pre-restoration validation.
 */
export const webdavService = {
  /**
   * Initializes the WebDAV service and hooks into storage changes.
   */
  init() {
    storageService.onSave(async (id) => {
      // Auto-sync on significant changes (playlists or settings)
      if (id.startsWith("playlist_") || id === "theme-choice") {
          try {
              const config = await this.getConfig();
              if (config.enabled && config.autoSync) {
                  await this.sync();
              }
          } catch (e) {
              console.error("WebDAV Auto-sync Trigger Failed:", e);
          }
      }
    });
  },

  async getConfig() {
    return await storageService.fetchObject("webdav_config", {
      url: "",
      username: "",
      password: "",
      enabled: false,
      autoSync: true,
      fileName: "yph_backup.json"
    });
  },

  async saveConfig(config: any) {
    await storageService.storeObject("webdav_config", config);
  },

  /**
   * Tests the connection to the WebDAV server.
   */
  async testConnection(): Promise<boolean> {
    const config = await this.getConfig();
    if (!config.url) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(config.url, {
        method: "PROPFIND",
        headers: {
          Authorization: "Basic " + btoa(config.username + ":" + config.password),
          Depth: "0",
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error("WebDAV connection failed:", error);
      return false;
    }
  },

  /**
   * Performs a synchronization operation (Upload local to remote).
   */
  async sync(): Promise<boolean> {
    const config = await this.getConfig();
    if (!config.enabled || !config.url) return false;

    console.log("WebDAV: Starting sync...");
    try {
      const allData = await storageService.fetchAllObjects();
      // Filter for data we want to sync
      const syncData = Object.keys(allData)
        .filter(key => key.startsWith("playlist_") || key === "theme-choice")
        .reduce((acc: any, key) => {
          acc[key] = allData[key];
          return acc;
        }, {});

      if (Object.keys(syncData).length === 0) {
          console.warn("WebDAV: Nothing to sync.");
          return true;
      }

      const targetUrl = config.url.endsWith("/") ? config.url + config.fileName : config.url + "/" + config.fileName;

      const response = await fetch(targetUrl, {
        method: "PUT",
        headers: {
          Authorization: "Basic " + btoa(config.username + ":" + config.password),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            timestamp: Date.now(),
            version: "2.0", // Upgraded protocol version
            data: syncData
        }),
      });

      if (response.ok) {
          console.log("WebDAV: Sync successful.");
          return true;
      } else {
          console.error("WebDAV: Sync failed with status", response.status);
          return false;
      }
    } catch (error) {
      console.error("WebDAV: Sync error:", error);
      return false;
    }
  },

  /**
   * Downloads data from the WebDAV server and restores it.
   */
  async downloadAndRestore(): Promise<boolean> {
      const config = await this.getConfig();
      if (!config.url) return false;

      const targetUrl = config.url.endsWith("/") ? config.url + config.fileName : config.url + "/" + config.fileName;

      try {
          const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
              Authorization: "Basic " + btoa(config.username + ":" + config.password),
            },
          });

          if (response.ok) {
              const remote = await response.json();

              // VALIDATION: Ensure remote data is valid and has a timestamp
              if (!remote || !remote.data || typeof remote.timestamp !== 'number') {
                  throw new Error("Malformed remote backup data.");
              }

              console.log("WebDAV: Validated remote data from", new Date(remote.timestamp).toLocaleString());

              // Restore data to local storage
              for (const key in remote.data) {
                  await storageService.storeObject(key, remote.data[key]);
              }
              return true;
          }
          return false;
      } catch (error) {
          console.error("WebDAV: Restore error:", error);
          return false;
      }
  }
};

// Initialize service
webdavService.init();
