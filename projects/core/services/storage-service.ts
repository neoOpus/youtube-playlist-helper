/// <reference path="../../../node_modules/@types/firefox-webext-browser/index.d.ts" />

import type { Playlist, PlaylistExport, Settings } from "../types/model.js";
import { backupService } from "./backup-service.js";

const PLAYLIST_KEY_PREFIX = "playlist_";
const ID_COUNTER_KEY = "PlaylistIdCounter";

function playlistToDto(playlist: Playlist) {
  const dto = { ...playlist };
  delete dto.loadedVideos;
  return dto;
}

function savedPlaylistsChanged() {
  if (typeof browser !== "undefined" && browser.runtime && browser.runtime.sendMessage) {
    browser.runtime.sendMessage({
      cmd: "update-saved-playlists",
    });
  }
}

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

export const storageService = {
  async fetchObject(id: string, defaultValue: any): Promise<any> {
    if (typeof browser !== "undefined" && browser.storage) {
      const result = await browser.storage.local.get(id);
      if (result && result[id] != null) {
        if (typeof defaultValue === "number") {
          return +result[id];
        }
        return result[id];
      }
      return defaultValue;
    } else {
      const value = localStorage.getItem(id);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          if (typeof defaultValue === "number") {
            return +parsed;
          }
          return parsed;
        } catch (e) {
          return value;
        }
      }
      return defaultValue;
    }
  },

  async storeObject(id: string, obj: any): Promise<void> {
    const value = obj ? (typeof obj === "string" ? obj : JSON.stringify(obj)) : null;
    if (typeof browser !== "undefined" && browser.storage) {
      const items = { [id]: value };
      await browser.storage.local.set(items);
    } else {
      if (value === null) {
        localStorage.removeItem(id);
      } else {
        localStorage.setItem(id, value);
      }
    }
  },

  async fetchAllObjects(): Promise<Record<string, any>> {
    if (typeof browser !== "undefined" && browser.storage) {
      return browser.storage.local.get(null);
    } else {
      const all: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) all[key] = localStorage.getItem(key);
      }
      return all;
    }
  },

  async removeObject(id: string): Promise<void> {
    if (typeof browser !== "undefined" && browser.storage) {
      await browser.storage.local.remove(id);
    } else {
      localStorage.removeItem(id);
    }
  },

  async generatePlaylistId(): Promise<string> {
    if (typeof browser !== "undefined" && browser.storage) {
      const obj = await browser.storage.local.get(ID_COUNTER_KEY);
      let count = obj[ID_COUNTER_KEY] || 0;
      count++;
      obj[ID_COUNTER_KEY] = count;
      await browser.storage.local.set(obj);
      return count.toString();
    } else {
      return Date.now().toString();
    }
  },

  async generatePlaylistIds(size: number): Promise<string[]> {
    if (typeof browser !== "undefined" && browser.storage) {
      const obj = await browser.storage.local.get(ID_COUNTER_KEY);
      let count = obj[ID_COUNTER_KEY] || 0;
      count++;
      const ids = [...Array(size).keys()].map((i) => (i + count).toString());
      obj[ID_COUNTER_KEY] = parseInt(ids[ids.length - 1]);
      await browser.storage.local.set(obj);
      return ids;
    } else {
      const count = Date.now();
      return [...Array(size).keys()].map((i) => (i + count).toString());
    }
  },

  async savePlaylist(playlist: Playlist): Promise<string> {
    let id = playlist.id;
    if (!playlist.saved) {
      id = await this.generatePlaylistId();
    }
    playlist = {
      ...playlist,
      timestamp: playlist.timestamp || Date.now(),
      id,
    };
    await this.storeObject(PLAYLIST_KEY_PREFIX + id, playlistToDto(playlist));
    savedPlaylistsChanged();
    backupService.performAutoBackup(await this.fetchAllObjects(), this.storeObject.bind(this));
    return id;
  },

  async getPlaylist(id: string): Promise<Playlist | null> {
    const item = await this.fetchObject(PLAYLIST_KEY_PREFIX + id, null);
    if (!item) return null;
    const playlist: Playlist = typeof item === 'string' ? JSON.parse(item) : item;
    playlist.saved = true;
    return playlist;
  },

  async getPlaylists(): Promise<Playlist[]> {
    const allItems = await this.fetchAllObjects();
    return Object.keys(allItems)
      .filter((key) => key.startsWith(PLAYLIST_KEY_PREFIX))
      .map((key) => {
        const playlist: Playlist = JSON.parse(allItems[key]);
        playlist.saved = true;
        return playlist;
      });
  },

  async removePlaylist(playlist: Playlist): Promise<void> {
    if (!playlist.saved) {
      localStorage.removeItem(PLAYLIST_KEY_PREFIX + playlist.id);
    } else {
      await this.removeObject(PLAYLIST_KEY_PREFIX + playlist.id);
      savedPlaylistsChanged();
    }
  },

  async getSettings(): Promise<Settings> {
    const settings = { ...DEFAULT_SETTINGS };
    await Promise.all(
      Object.keys(DEFAULT_SETTINGS).map(async (key) => {
        const value = await this.fetchObject(key, DEFAULT_SETTINGS[key]);
        settings[key] = value;
      })
    );
    return settings;
  }
};

// Legacy support for background scripts (for now)
if (typeof window !== 'undefined') {
    (window as any).getSettings = storageService.getSettings.bind(storageService);
    (window as any).getPlaylists = storageService.getPlaylists.bind(storageService);
    (window as any).getPlaylist = storageService.getPlaylist.bind(storageService);
    (window as any).savePlaylist = storageService.savePlaylist.bind(storageService);
    (window as any).fetchObject = storageService.fetchObject.bind(storageService);
    (window as any).storeObject = storageService.storeObject.bind(storageService);
    (window as any).fetchAllObjects = storageService.fetchAllObjects.bind(storageService);
}
