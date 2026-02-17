import { storage } from '../core/storage-service';
import type { Playlist } from "../../types/model";

export const backupService = {
  async performAutoBackup() {
    try {
      const allData = await storage.getAll();
      const playlists = Object.keys(allData)
        .filter((key) => key.startsWith("playlist_"))
        .map((key) => JSON.parse(allData[key]));

      if (playlists.length === 0) return;

      const backup = {
        timestamp: Date.now(),
        playlists,
      };

      const backupKey = `backup_${new Date().toISOString().split("T")[0]}`;
      await storage.set(backupKey, backup);
      console.log("Auto-backup performed successfully.");
    } catch (error) {
      console.error("Failed to perform auto-backup:", error);
    }
  },

  async getBackups() {
    const allData = await storage.getAll();
    return Object.keys(allData)
      .filter((key) => key.startsWith("backup_"))
      .map((key) => ({
        key,
        ...JSON.parse(allData[key])
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  async deleteBackup(key: string) {
    await storage.remove(key);
  },

  async restoreBackup(key: string) {
    const allData = await storage.getAll();
    const backup = JSON.parse(allData[key]);
    if (backup && backup.playlists) {
       await window.importPlaylists(backup.playlists);
       return true;
    }
    return false;
  }
};
