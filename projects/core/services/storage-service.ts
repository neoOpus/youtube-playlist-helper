/// <reference path="../types/services.ts" />

import type { Playlist, Settings } from "../types/model";
import { eventBus, EVENTS } from "./event-bus";

const PLAYLIST_KEY_PREFIX = "playlist_";
const ID_COUNTER_KEY = "PlaylistIdCounter";

function playlistToDto(playlist: Playlist) {
  const dto = { ...playlist };
  delete dto.loadedVideos;
  return dto;
}

function notifySavedPlaylistsChanged() {
  if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
    chrome.runtime.sendMessage({
      cmd: "update-saved-playlists",
    }).catch(() => {});
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
  async fetchObject<T>(id: string, defaultValue: T): Promise<T> {
    if (typeof chrome !== "undefined" && chrome.storage) {
      const result = await chrome.storage.local.get(id);
      if (result && result[id] != null) {
        return result[id] as T;
      }
      return defaultValue;
    } else {
      const value = localStorage.getItem(id);
      if (value) {
        try {
          return JSON.parse(value) as T;
        } catch (e) {
          return value as unknown as T;
        }
      }
      return defaultValue;
    }
  },

  async storeObject<T>(id: string, obj: T): Promise<void> {
    const value = obj;
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.local.set({ [id]: value });
    } else {
      if (value === null) {
        localStorage.removeItem(id);
      } else {
        localStorage.setItem(id, JSON.stringify(value));
      }
    }
  },

  async fetchAllObjects(): Promise<Record<string, unknown>> {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return await chrome.storage.local.get(null);
    } else {
      const all: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const val = localStorage.getItem(key);
            try {
                all[key] = val ? JSON.parse(val) : val;
            } catch {
                all[key] = val;
            }
        }
      }
      return all;
    }
  },

  async removeObject(id: string): Promise<void> {
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.local.remove(id);
    } else {
      localStorage.removeItem(id);
    }
  },

  async generatePlaylistId(): Promise<string> {
    if (typeof chrome !== "undefined" && chrome.storage) {
      const obj = await chrome.storage.local.get(ID_COUNTER_KEY);
      let count = obj[ID_COUNTER_KEY] || 0;
      count++;
      await chrome.storage.local.set({ [ID_COUNTER_KEY]: count });
      return count.toString();
    } else {
      return Date.now().toString();
    }
  },

  async savePlaylist(playlist: Playlist): Promise<string> {
    let id = playlist.id;
    if (!playlist.saved) {
      id = await this.generatePlaylistId();
    }
    playlist = { ...playlist, timestamp: playlist.timestamp || Date.now(), id };
    await this.storeObject(PLAYLIST_KEY_PREFIX + id, playlistToDto(playlist));
    eventBus.emit(EVENTS.PLAYLIST_SAVED, playlist);
    notifySavedPlaylistsChanged();
    return id;
  },

  async getPlaylist(id: string): Promise<Playlist | null> {
    const item = await this.fetchObject<Playlist | null>(PLAYLIST_KEY_PREFIX + id, null);
    if (!item) return null;
    item.saved = true;
    return item;
  },

  async getPlaylists(): Promise<Playlist[]> {
    const allItems = await this.fetchAllObjects();
    return Object.keys(allItems)
      .filter((key) => key.startsWith(PLAYLIST_KEY_PREFIX))
      .map((key) => {
        const item = allItems[key] as Playlist;
        item.saved = true;
        return item;
      });
  },

  async removePlaylist(playlist: Playlist): Promise<void> {
    const key = PLAYLIST_KEY_PREFIX + playlist.id;
    await this.removeObject(key);
    eventBus.emit(EVENTS.PLAYLIST_DELETED, playlist.id);
    notifySavedPlaylistsChanged();
  },

  async getSettings(): Promise<Settings> {
    const settings = { ...DEFAULT_SETTINGS };
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
        const k = key as keyof Settings;
        settings[k] = await this.fetchObject(k, DEFAULT_SETTINGS[k]) as any;
    }
    return settings;
  }
};
