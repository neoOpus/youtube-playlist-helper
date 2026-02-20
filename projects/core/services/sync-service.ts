import { storageService } from "./storage-service";
import { eventBus, EVENTS } from "./event-bus";

/**
 * Service for synchronizing data with external cloud providers.
 */
export const syncService = {
  /**
   * Initializes the sync service by registering it with the event bus.
   */
  init() {
    eventBus.on(EVENTS.PLAYLIST_SAVED, async () => {
        await this.sync();
    });
  },

  async getSyncConfig() {
    return await storageService.fetchObject("sync_config", {
      provider: "none",
      enabled: false,
    });
  },

  async saveSyncConfig(config: any) {
    await storageService.storeObject("sync_config", config);
  },

  /**
   * Triggers a sync operation.
   */
  async sync() {
    const config = await this.getSyncConfig();
    if (!config.enabled) return;

    eventBus.emit(EVENTS.SYNC_STARTED, undefined);
    console.log("Starting sync with provider:", config.provider);

    try {
        // Logic for WebDAV or Google Drive would go here
        // (Previously implemented in webdavService, we could call it here)
        eventBus.emit(EVENTS.SYNC_COMPLETED, undefined);
    } catch (error) {
        console.error("Sync failed:", error);
        eventBus.emit(EVENTS.SYNC_ERROR, error);
    }
  },
};

// Initialize
syncService.init();
