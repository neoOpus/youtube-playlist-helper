/// <reference path="../../node_modules/@types/firefox-webext-browser/index.d.ts" />

import type { Playlist, Settings } from "../../types/model.js";
import LZString from "lz-string";

const PLAYLIST_KEY_PREFIX = "playlist_";
const TRASH_KEY_PREFIX = "trash_";
const PENDING_OPS_KEY = "storage_pending_ops";
const BROADCAST_CHANNEL = "yph_sync_channel";

const syncChannel = typeof window !== 'undefined' ? new BroadcastChannel(BROADCAST_CHANNEL) : null;

function playlistToDto(playlist: Playlist) {
  const dto = { ...playlist };
  delete dto.loadedVideos;
  return dto;
}

export const storage: any = {
    async get(key: string, defaultValue: any = null) {
        let raw;
        if (typeof browser !== 'undefined' && browser.storage) {
            const res = await browser.storage.local.get(key);
            raw = res[key];
        } else {
            raw = localStorage.getItem(key);
        }

        if (raw === undefined || raw === null) return defaultValue;

        try {
            const decompressed = LZString.decompressFromUTF16(raw);
            if (decompressed) return JSON.parse(decompressed);
            return JSON.parse(raw);
        } catch (e) {
            try { return JSON.parse(raw); } catch { return raw; }
        }
    },

    async set(key: string, value: any, silent = false) {
        const valStr = JSON.stringify(value);
        const compressed = LZString.compressToUTF16(valStr);

        if (typeof browser !== 'undefined' && browser.storage) {
            await browser.storage.local.set({ [key]: compressed });
        } else {
            localStorage.setItem(key, compressed);
        }

        if (!silent && syncChannel) {
            syncChannel.postMessage({ type: 'UPDATE', key });
        }
    },

    async remove(key: string, silent = false) {
        if (typeof browser !== 'undefined' && browser.storage) {
            await browser.storage.local.remove(key);
        } else {
            localStorage.removeItem(key);
        }

        if (!silent && syncChannel) {
            syncChannel.postMessage({ type: 'DELETE', key });
        }
    },

    async getAll() {
        const all = (typeof browser !== 'undefined' && browser.storage) ? await browser.storage.local.get(null) : { ...localStorage };
        const parsed = {};
        for (const key in all) {
            try {
                const decompressed = LZString.decompressFromUTF16(all[key]);
                parsed[key] = decompressed ? JSON.parse(decompressed) : JSON.parse(all[key]);
            } catch {
                parsed[key] = all[key];
            }
        }
        return parsed;
    }
};

const transactionManager = {
    async logOp(op: { type: 'set' | 'remove', key: string, data?: any }) {
        const ops = await storage.get(PENDING_OPS_KEY, []);
        ops.push({ ...op, id: Date.now() });
        await storage.set(PENDING_OPS_KEY, ops, true);
    },

    async commitOp(opId: number) {
        let ops = await storage.get(PENDING_OPS_KEY, []);
        ops = ops.filter(o => o.id !== opId);
        await storage.set(PENDING_OPS_KEY, ops, true);
    },

    async recover() {
        const ops = await storage.get(PENDING_OPS_KEY, []);
        if (ops.length > 0) {
            console.warn("Recovering storage from pending operations...", ops);
            for (const op of ops) {
                if (op.type === 'set') await storage.set(op.key, op.data, true);
                else if (op.type === 'remove') await storage.remove(op.key, true);
            }
            await storage.set(PENDING_OPS_KEY, [], true);
        }
    }
};

transactionManager.recover();

const ID_COUNTER_KEY = "PlaylistIdCounter";
storage.generatePlaylistId = async () => {
    let count = await storage.get(ID_COUNTER_KEY, 0);
    count++;
    await storage.set(ID_COUNTER_KEY, count);
    return count.toString();
};

storage.savePlaylist = async (playlist: Playlist) => {
  let id = playlist.id;
  if (!playlist.saved) id = await storage.generatePlaylistId();

  playlist = {
    timestamp: Date.now(),
    ...playlist,
    id,
    version: (playlist.version || 0) + 1
  };

  const key = PLAYLIST_KEY_PREFIX + id;
  const dto = playlistToDto(playlist);
  const opId = Date.now();

  await transactionManager.logOp({ type: 'set', key, data: dto });
  await storage.set(key, dto);
  await transactionManager.commitOp(opId);

  savedPlaylistsChanged();
  import("../mega/backup-service.js").then(m => m.backupService.performAutoBackup());
  return id;
};

storage.removePlaylist = async (playlist: Playlist) => {
  const key = PLAYLIST_KEY_PREFIX + playlist.id;
  const trashKey = TRASH_KEY_PREFIX + playlist.id;

  if (playlist.saved) {
    const data = await storage.get(key);
    await storage.set(trashKey, { ...data, deletedAt: Date.now() });
    await storage.remove(key);
    savedPlaylistsChanged();
  } else {
    localStorage.removeItem(key);
  }
};

storage.getTrash = async () => {
    const all = await storage.getAll();
    return Object.keys(all)
        .filter(k => k.startsWith(TRASH_KEY_PREFIX))
        .map(k => all[k]);
};

storage.restoreFromTrash = async (playlistId: string) => {
    const trashKey = TRASH_KEY_PREFIX + playlistId;
    const key = PLAYLIST_KEY_PREFIX + playlistId;
    const data = await storage.get(trashKey);
    if (data) {
        delete data.deletedAt;
        await storage.set(key, data);
        await storage.remove(trashKey);
        savedPlaylistsChanged();
        return true;
    }
    return false;
};

storage.getPlaylists = async () => {
  const allItems = await storage.getAll();
  return Object.keys(allItems)
    .filter((key) => key.startsWith(PLAYLIST_KEY_PREFIX))
    .map((key) => {
      const playlist: Playlist = allItems[key];
      playlist.saved = true;
      return playlist;
    });
};

storage.getPlaylist = async (id: string) => {
  const item = await storage.get(PLAYLIST_KEY_PREFIX + id);
  if (!item) return null;
  const playlist: Playlist = item;
  playlist.saved = true;
  return playlist;
};

storage.getSettings = async () => {
  const DEFAULT_SETTINGS: Settings = {
    openPlaylistEditorAfterCreation: true,
    openPlaylistPage: false,
    closeAfterCombine: false,
    disableThumbnails: false,
    openPlaylistBuilderAfterAdd: true,
    openSavedPlaylistAfterAdd: true,
    defaultEditorPage: "/saved",
    saveCreatedPlaylists: false,
    disableContextBuilder: false,
    disableContextSaved: false,
    themeChoice: "device",
    viewMode: "simple",
    privacyMode: false,
  };
  const settings = { ...DEFAULT_SETTINGS };
  const keys = Object.keys(DEFAULT_SETTINGS);
  for (const key of keys) {
      settings[key] = await storage.get(key, (DEFAULT_SETTINGS as any)[key]);
  }
  return settings;
};

function savedPlaylistsChanged() {
  if (typeof browser !== 'undefined' && browser.runtime) {
      browser.runtime.sendMessage({ cmd: "update-saved-playlists" });
  }
}
