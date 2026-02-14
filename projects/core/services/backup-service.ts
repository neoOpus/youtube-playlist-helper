import { storageService } from "./storage-service";

/**
 * Service for performing automatic backups of playlists.
 */
export const backupService = {
  /**
   * Initializes the backup service by registering it with the storage service.
   */
  init() {
    storageService.onSave(async (id) => {
        if (id.startsWith("playlist_")) {
            await this.performAutoBackup();
        }
    });
  },

  /**
   * Performs an automatic backup by saving all current playlists to a daily snapshot.
   */
  async performAutoBackup() {
    try {
      const allData = await storageService.fetchAllObjects();
      const playlists = Object.keys(allData)
        .filter((key) => key.startsWith("playlist_"))
        .map((key) => {
            const item = allData[key];
            return typeof item === 'string' ? JSON.parse(item) : item;
        });

      if (playlists.length === 0) return;

      const backup = {
        timestamp: Date.now(),
        playlists,
      };

      const backupKey = `backup_${new Date().toISOString().split("T")[0]}`;
      // Use internal storage call to avoid triggering the backup loop if we ever store backups differently
      await storageService.storeObject(backupKey, backup);
      console.log("Auto-backup performed successfully.");
    } catch (error) {
      console.error("Failed to perform auto-backup:", error);
    }
  },
};

// Initialize the service automatically
backupService.init();
