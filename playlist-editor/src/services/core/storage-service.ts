/// <reference path="../../node_modules/@types/firefox-webext-browser/index.d.ts" />

import type { Playlist, PlaylistExport, Settings } from "../../types/model.js";
import { backupService } from "../mega/backup-service.js";

const PLAYLIST_KEY_PREFIX = "playlist_";
const PENDING_OPS_KEY = "storage_pending_ops";

function playlistToDto(playlist: Playlist) {
  const dto = { ...playlist };
  delete dto.loadedVideos;
  return dto;
}

// Transactional storage wrapper
const storage = {
    async get(key: string, defaultValue: any = null) {
        if (typeof browser !== 'undefined') {
            const res = await browser.storage.local.get(key);
            return res[key] !== undefined ? (typeof res[key] === 'string' ? JSON.parse(res[key]) : res[key]) : defaultValue;
        } else {
            const res = localStorage.getItem(key);
            return res ? JSON.parse(res) : defaultValue;
        }
    },

    async set(key: string, value: any) {
        const valStr = JSON.stringify(value);
        if (typeof browser !== 'undefined') {
            await browser.storage.local.set({ [key]: valStr });
        } else {
            localStorage.setItem(key, valStr);
        }
    },

    async remove(key: string) {
        if (typeof browser !== 'undefined') {
            await browser.storage.local.remove(key);
        } else {
            localStorage.removeItem(key);
        }
    },

    async getAll() {
        if (typeof browser !== 'undefined') {
            return await browser.storage.local.get(null);
        } else {
            return { ...localStorage };
        }
    }
};

const transactionManager = {
    async logOp(op: { type: 'set' | 'remove', key: string, data?: any }) {
        const ops = await storage.get(PENDING_OPS_KEY, []);
        ops.push({ ...op, id: Date.now() });
        await storage.set(PENDING_OPS_KEY, ops);
    },

    async commitOp(opId: number) {
        let ops = await storage.get(PENDING_OPS_KEY, []);
        ops = ops.filter(o => o.id !== opId);
        await storage.set(PENDING_OPS_KEY, ops);
    },

    async recover() {
        const ops = await storage.get(PENDING_OPS_KEY, []);
        if (ops.length > 0) {
            console.warn("Recovering storage from pending operations...", ops);
            for (const op of ops) {
                if (op.type === 'set') {
                    await storage.set(op.key, op.data);
                } else if (op.type === 'remove') {
                    await storage.remove(op.key);
                }
            }
            await storage.set(PENDING_OPS_KEY, []);
        }
    }
};

// Auto-recover on load
transactionManager.recover();

window.fetchObject = storage.get;
window.storeObject = storage.set;
window.removeObject = storage.remove;
window.fetchAllObjects = storage.getAll;

window.savePlaylist = async (playlist: Playlist) => {
  let id = playlist.id;
  if (!playlist.saved) {
    id = await window.generatePlaylistId();
  }
  playlist = {
    timestamp: Date.now(),
    ...playlist,
    id,
    version: (playlist.version || 0) + 1
  };

  const key = PLAYLIST_KEY_PREFIX + id;
  const dto = playlistToDto(playlist);

  const op: { type: 'set' | 'remove', key: string, data?: any, id: number } = { type: 'set', key, data: dto, id: Date.now() };
  await transactionManager.logOp(op);
  await storage.set(key, dto);
  await transactionManager.commitOp(op.id);

  savedPlaylistsChanged();
  backupService.performAutoBackup();
  return id;
};

window.importPlaylists = async (playlistsExport: PlaylistExport[]) => {
  const ids = await window.generatePlaylistIds(playlistsExport.length);
  const playlists = playlistsExport.map((p) => ({ ...p, id: ids.shift(), version: 1 }));

  for (const playlist of playlists) {
      const key = PLAYLIST_KEY_PREFIX + playlist.id;
      const dto = playlistToDto(playlist as Playlist);
      await storage.set(key, dto);
  }
  savedPlaylistsChanged();
};

window.removePlaylist = async (playlist: Playlist) => {
  const key = PLAYLIST_KEY_PREFIX + playlist.id;
  if (!playlist.saved) {
    localStorage.removeItem(key);
  } else {
    await storage.remove(key);
    savedPlaylistsChanged();
  }
};

window.getPlaylists = async () => {
  const allItems = await storage.getAll();
  return Object.keys(allItems)
    .filter((key) => key.startsWith(PLAYLIST_KEY_PREFIX))
    .map((key) => {
      const playlist: Playlist = typeof allItems[key] === 'string' ? JSON.parse(allItems[key]) : allItems[key];
      playlist.saved = true;
      return playlist;
    });
};

window.getPlaylist = async (id) => {
  const item = await storage.get(PLAYLIST_KEY_PREFIX + id);
  if (!item) return null;
  const playlist: Playlist = typeof item === 'string' ? JSON.parse(item) : item;
  playlist.saved = true;
  return playlist;
};

const ID_COUNTER_KEY = "PlaylistIdCounter";
window.generatePlaylistId = async () => {
    let count = await storage.get(ID_COUNTER_KEY, 0);
    count++;
    await storage.set(ID_COUNTER_KEY, count);
    return count.toString();
};

window.generatePlaylistIds = async (size: number) => {
    let count = await storage.get(ID_COUNTER_KEY, 0);
    const ids = [];
    for (let i = 0; i < size; i++) {
        count++;
        ids.push(count.toString());
    }
    await storage.set(ID_COUNTER_KEY, count);
    return ids;
};

window.getSettings = async () => {
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
  };
  const settings = { ...DEFAULT_SETTINGS };
  const keys = Object.keys(DEFAULT_SETTINGS);
  for (const key of keys) {
      settings[key] = await storage.get(key, DEFAULT_SETTINGS[key]);
  }
  return settings;
};

function savedPlaylistsChanged() {
  if (typeof browser !== 'undefined') {
      browser.runtime.sendMessage({ cmd: "update-saved-playlists" });
  }
}

export {};
