import { storageService } from "./storage-service.js";

export type SyncState = "idle" | "syncing" | "stable" | "error";

export const syncService = {
  async getSyncConfig() {
    return await storageService.fetchObject("sync_config", {
      enabled: false,
      serverUrl: "",
      apiKey: ""
    });
  },

  async saveSyncConfig(config: any) {
    await storageService.storeObject("sync_config", config);
  },

  async performSync(direction: "push" | "pull", onStateChange?: (state: string) => void): Promise<boolean> {
    const config = await this.getSyncConfig();
    if (!config.enabled) return false;

    try {
        onStateChange?.("syncing");
        if (!config.serverUrl || !config.apiKey) throw new Error("Credentials missing");

        await new Promise(r => setTimeout(r, 1000));
        onStateChange?.("stable");
        return true;
    } catch (e) {
        onStateChange?.("error");
        return false;
    }
  }
};
