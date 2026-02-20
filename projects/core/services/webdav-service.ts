import { storageService } from "./storage-service";

interface WebDAVConfig {
    url: string;
    username: string;
    password: string;
    enabled: boolean;
    autoSync: boolean;
    fileName: string;
    lastSyncTimestamp: number;
}

/**
 * Service for WebDAV synchronization with smart merging.
 * Engineering by Anoir Ben Tanfous aka neoOpus.
 */
export const webdavService = {
  init() {
    // This hook is now ideally handled by the EventBus to avoid circular refs,
    // but keeping here as a secondary observer for robustness.
  },

  async getConfig(): Promise<WebDAVConfig> {
    return await storageService.fetchObject<WebDAVConfig>("webdav_config", {
      url: "",
      username: "",
      password: "",
      enabled: false,
      autoSync: true,
      fileName: "yph_backup.json",
      lastSyncTimestamp: 0
    });
  },

  async saveConfig(config: WebDAVConfig) {
    await storageService.storeObject("webdav_config", config);
  },

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

  async sync(): Promise<boolean> {
    const config = await this.getConfig();
    if (!config.enabled || !config.url) return false;

    console.log("WebDAV: Starting Smart Sync...");
    try {
      const targetUrl = config.url.endsWith("/") ? config.url + config.fileName : config.url + "/" + config.fileName;
      let remoteData: Record<string, unknown> | null = null;

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

      const allLocal = await storageService.fetchAllObjects();
      const localData = Object.keys(allLocal)
        .filter(key => key.startsWith("playlist_") || key === "theme-choice")
        .reduce((acc: Record<string, unknown>, key) => {
          acc[key] = allLocal[key];
          return acc;
        }, {});

      const mergedData = this.merge(localData, remoteData || {});

      for (const key in mergedData) {
          await storageService.storeObject(key, mergedData[key]);
      }

      const putRes = await fetch(targetUrl, {
        method: "PUT",
        headers: {
          Authorization: "Basic " + btoa(config.username + ":" + config.password),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            timestamp: Date.now(),
            version: "1.2",
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

  merge(local: Record<string, any>, remote: Record<string, any>): Record<string, any> {
      const merged: Record<string, any> = { ...remote };

      for (const key in local) {
          if (!merged[key]) {
              merged[key] = local[key];
              continue;
          }

          const localItem = local[key];
          const remoteItem = merged[key];

          if (typeof localItem === 'object' && localItem !== null && 'timestamp' in localItem &&
              typeof remoteItem === 'object' && remoteItem !== null && 'timestamp' in remoteItem) {

              if (localItem.timestamp > remoteItem.timestamp) {
                  merged[key] = localItem;
              }
          } else {
              merged[key] = localItem;
          }
      }

      return merged;
  },

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

              const data = remote.data as Record<string, unknown>;
              for (const key in data) {
                  await storageService.storeObject(key, data[key]);
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
