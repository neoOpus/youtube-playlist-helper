import { storageService } from "./storage-service";

/**
 * Service for WebDAV synchronization with smart merging.
 */
export const webdavService = {
  /**
   * Initializes the WebDAV service and hooks into storage changes.
   */
  init() {
    storageService.onSave(async (id) => {
      // Auto-sync on significant changes (playlists or significant settings)
      if (id.startsWith("playlist_") || id === "theme-choice") {
          const config = await this.getConfig();
          if (config.enabled && config.autoSync) {
              await this.sync();
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
      fileName: "yph_backup.json",
      lastSyncTimestamp: 0
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
      const response = await fetch(config.url, {
        method: "PROPFIND",
        headers: {
          Authorization: "Basic " + btoa(config.username + ":" + config.password),
          Depth: "0",
        },
      });
      return response.ok;
    } catch (error) {
      console.error("WebDAV connection failed:", error);
      return false;
    }
  },

  /**
   * Performs a synchronization operation (Two-way Merge).
   */
  async sync(): Promise<boolean> {
    const config = await this.getConfig();
    if (!config.enabled || !config.url) return false;

    console.log("WebDAV: Starting Smart Sync...");
    try {
      // 1. Fetch Remote Data
      const targetUrl = config.url.endsWith("/") ? config.url + config.fileName : config.url + "/" + config.fileName;
      let remoteData: any = null;

      try {
          const getRes = await fetch(targetUrl, {
            method: "GET",
            headers: {
              Authorization: "Basic " + btoa(config.username + ":" + config.password),
            },
          });
          if (getRes.ok) {
              const json = await getRes.json();
              remoteData = json.data;
          }
      } catch (e) {
          console.log("WebDAV: No remote file found or unreachable, performing initial upload.");
      }

      // 2. Fetch Local Data
      const allLocal = await storageService.fetchAllObjects();
      const localData = Object.keys(allLocal)
        .filter(key => key.startsWith("playlist_") || key === "theme-choice")
        .reduce((acc: any, key) => {
          acc[key] = allLocal[key];
          return acc;
        }, {});

      // 3. Merge
      const mergedData = this.merge(localData, remoteData || {});

      // 4. Update Local Storage with Merged Data
      for (const key in mergedData) {
          // Optimization: only store if it changed?
          // For now, let's keep it simple.
          await storageService.storeObject(key, mergedData[key]);
      }

      // 5. Upload Merged Data to Remote
      const putRes = await fetch(targetUrl, {
        method: "PUT",
        headers: {
          Authorization: "Basic " + btoa(config.username + ":" + config.password),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            timestamp: Date.now(),
            version: "1.1",
            data: mergedData
        }),
      });

      if (putRes.ok) {
          console.log("WebDAV: Smart Sync successful.");
          config.lastSyncTimestamp = Date.now();
          await this.saveConfig(config);
          return true;
      } else {
          console.error("WebDAV: Upload failed with status", putRes.status);
          return false;
      }
    } catch (error) {
      console.error("WebDAV: Sync error:", error);
      return false;
    }
  },

  /**
   * Merges local and remote data per-item based on timestamps.
   */
  merge(local: Record<string, any>, remote: Record<string, any>): Record<string, any> {
      const merged: Record<string, any> = { ...remote };

      for (const key in local) {
          if (!merged[key]) {
              merged[key] = local[key];
              continue;
          }

          const localItem = local[key];
          const remoteItem = merged[key];

          // If it's a playlist, it has a timestamp
          if (typeof localItem === 'object' && localItem.timestamp &&
              typeof remoteItem === 'object' && remoteItem.timestamp) {

              if (localItem.timestamp > remoteItem.timestamp) {
                  merged[key] = localItem;
              }
              // Else keep remoteItem which is already in merged
          } else {
              // For simple settings without timestamps, prefer local for now
              merged[key] = localItem;
          }
      }

      return merged;
  },

  /**
   * Legacy method for manual full restore (overwrite).
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
              console.log("WebDAV: Downloaded remote data from", new Date(remote.timestamp).toLocaleString());

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
