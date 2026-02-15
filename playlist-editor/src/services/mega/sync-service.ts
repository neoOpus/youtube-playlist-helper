import { supabaseService } from "./supabase-service";

export interface SyncConfig {
  enabled: boolean;
  type: "webdav" | "google" | "supabase";
  url?: string;
  username?: string;
  password?: string;
  lastSync?: number;
}

class SyncService {
  async getSyncConfig(): Promise<SyncConfig> {
    return await window.fetchObject("sync_config", {
      enabled: false,
      type: "supabase",
    });
  }

  async saveSyncConfig(config: SyncConfig) {
    await window.storeObject("sync_config", config);
  }

  async syncNow() {
    const config = await this.getSyncConfig();
    if (!config.enabled) throw new Error("Sync is disabled");

    if (config.type === "supabase") {
        if (!supabaseService.isConfigured) throw new Error("Supabase is not configured");

        const localPlaylists = await window.getPlaylists();
        const remotePlaylists = await supabaseService.fetchRemotePlaylists();

        // Conflict Resolution Strategy: Last Write Wins based on 'version' and 'timestamp'
        for (const local of localPlaylists) {
            const remote = remotePlaylists.find(p => p.id === local.id);
            if (!remote || (local.version || 0) > (remote.version || 0)) {
                // Local is newer or remote doesn't exist
                await supabaseService.syncPlaylists([local]);
            } else if ((remote.version || 0) > (local.version || 0)) {
                // Remote is newer
                await window.savePlaylist(remote);
            }
        }

        // Handle playlists that exist on remote but not on local
        for (const remote of remotePlaylists) {
            if (!localPlaylists.find(p => p.id === remote.id)) {
                await window.savePlaylist(remote);
            }
        }

    } else if (config.type === "webdav") {
        await this.performWebDavSync(config);
    }

    config.lastSync = Date.now();
    await this.saveSyncConfig(config);
  }

  private async performWebDavSync(config: SyncConfig) {
    if (!config.url) throw new Error("WebDAV URL missing");
    const allData = await window.fetchAllObjects();
    const payload = JSON.stringify(allData);
    const headers = new Headers();
    if (config.username && config.password) {
        headers.set('Authorization', 'Basic ' + btoa(config.username + ":" + config.password));
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(config.url, {
        method: 'PUT',
        headers,
        body: payload
    });

    if (!response.ok) throw new Error(`WebDAV error: ${response.status}`);
  }

  async pullFromCloud() {
    const config = await this.getSyncConfig();
    if (!config.enabled) throw new Error("Sync not configured");

    if (config.type === "supabase") {
        const remote = await supabaseService.fetchRemotePlaylists();
        if (remote.length > 0) {
            await window.importPlaylists(remote);
            return true;
        }
    }
    return false;
  }

  async runHealthCheck() {
      const playlists = await window.getPlaylists();
      let issuesFound = 0;
      for (const p of playlists) {
          const validVideos = p.videos.filter(v => v && v.length > 5);
          if (validVideos.length !== p.videos.length) {
              p.videos = validVideos;
              await window.savePlaylist(p);
              issuesFound++;
          }
      }
      return issuesFound;
  }
}

export const syncService = new SyncService();
