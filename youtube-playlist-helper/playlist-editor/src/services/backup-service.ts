export const backupService = {
  async performAutoBackup() {
    try {
      const allData = await window.fetchAllObjects();
      const playlists = Object.keys(allData)
        .filter((key) => key.startsWith("playlist_"))
        .map((key) => JSON.parse(allData[key]));

      if (playlists.length === 0) return;

      const backup = {
        timestamp: Date.now(),
        playlists,
      };

      const backupKey = `backup_${new Date().toISOString().split("T")[0]}`;
      await window.storeObject(backupKey, backup);
      console.log("Auto-backup performed successfully.");
    } catch (error) {
      console.error("Failed to perform auto-backup:", error);
    }
  },
};
