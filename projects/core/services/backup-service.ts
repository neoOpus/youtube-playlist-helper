/**
 * Service for performing automatic backups of playlists.
 */
export const backupService = {
  /**
   * Performs an automatic backup by saving all current playlists to a daily snapshot.
   * @param allObjects All objects currently in storage.
   * @param storeObject Function to store an object.
   */
  async performAutoBackup(allObjects: Record<string, any>, storeObject: (id: string, obj: any) => Promise<void>) {
    try {
      const playlists = Object.keys(allObjects)
        .filter((key) => key.startsWith("playlist_"))
        .map((key) => JSON.parse(allObjects[key]));

      if (playlists.length === 0) return;

      const backup = {
        timestamp: Date.now(),
        playlists,
      };

      const backupKey = `backup_${new Date().toISOString().split("T")[0]}`;
      await storeObject(backupKey, backup);
      console.log("Auto-backup performed successfully.");
    } catch (error) {
      console.error("Failed to perform auto-backup:", error);
    }
  },
};
