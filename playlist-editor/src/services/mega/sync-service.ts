import { storage } from '../core/storage-service';
import { supabaseService } from "./supabase-service";
import { cryptoUtils } from "../core/crypto-utils";

export interface SyncConfig {
  enabled: boolean;
  type: "google" | "webdav" | "supabase";
  url?: string;
  username?: string;
  password?: string;
  lastSync?: number;
}

const CRYPTO_SECRET = "yph-extension-internal-key";

class SyncService {
  async getSyncConfig(): Promise<SyncConfig> {
    const config = (await storage.get("sync_config", {
      enabled: false,
      type: "supabase",
    })) as SyncConfig;

    if (config.password) {
        config.password = await cryptoUtils.decrypt(config.password, CRYPTO_SECRET);
    }
    return config;
  }

  async saveSyncConfig(config: SyncConfig) {
    const toSave = { ...config };
    if (toSave.password) {
        toSave.password = await cryptoUtils.encrypt(toSave.password, CRYPTO_SECRET);
    }
    await storage.set("sync_config", toSave);
  }

  async syncNow() {
    const config = await this.getSyncConfig();
    if (!config.enabled) throw new Error("Sync is disabled");

    if (config.type === "supabase") {
        if (!supabaseService.isConfigured) throw new Error("Supabase is not configured");
        const localPlaylists = await storage.getPlaylists();
        const remotePlaylists = await supabaseService.fetchRemotePlaylists();

        for (const local of localPlaylists) {
            const remote = remotePlaylists.find(p => p.id === local.id);
            if (!remote || (local.version || 0) > (remote.version || 0)) {
                await supabaseService.syncPlaylists([local]);
            } else if ((remote.version || 0) > (local.version || 0)) {
                await storage.savePlaylist(remote);
            }
        }

        for (const remote of remotePlaylists) {
            if (!localPlaylists.find(p => p.id === remote.id)) {
                await storage.savePlaylist(remote);
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
    const allData = await storage.getAll();
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
}

export const syncService = new SyncService();
