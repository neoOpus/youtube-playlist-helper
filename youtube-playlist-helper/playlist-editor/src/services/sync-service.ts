export interface SyncConfig {
  enabled: boolean;
  type: "webdav" | "google";
  url?: string;
  username?: string;
  password?: string;
}

export const syncService = {
  async getSyncConfig(): Promise<SyncConfig> {
    return await window.fetchObject("sync_config", {
      enabled: false,
      type: "webdav",
    });
  },

  async saveSyncConfig(config: SyncConfig) {
    await window.storeObject("sync_config", config);
  },

  async syncNow() {
    const config = await this.getSyncConfig();
    if (!config.enabled) {
      throw new Error("Sync is disabled");
    }

    console.log(`Starting ${config.type} sync...`);
    // Simulate network activity
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const allData = await window.fetchAllObjects();
    const payload = JSON.stringify(allData);

    if (config.type === "webdav") {
      console.log(`Uploading to WebDAV: ${config.url}`);
      // Scaffolding for WebDAV PUT request
    }

    console.log("Sync complete");
  },
};
