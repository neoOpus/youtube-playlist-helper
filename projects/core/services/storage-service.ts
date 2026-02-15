/// <reference path="../types/services.ts" />

import type { Playlist, Settings } from "../types/model";
import { eventBus, EVENTS } from "./event-bus";

/**
 * Prefix for playlist keys in storage.
 */
const PLAYLIST_KEY_PREFIX = "playlist_";

/**
 * Key for the playlist ID counter.
 */
const ID_COUNTER_KEY = "PlaylistIdCounter";

/**
 * Converts a playlist object to a DTO for storage.
 * @param playlist The playlist to convert.
 * @returns The playlist DTO.
 */
function playlistToDto(playlist: Playlist) {
  const dto = { ...playlist };
  delete dto.loadedVideos;
  return dto;
}

/**
 * Notifies the extension that saved playlists have changed.
 */
function notifySavedPlaylistsChanged() {
  if (typeof browser !== "undefined" && browser.runtime?.sendMessage) {
    browser.runtime.sendMessage({
      cmd: "update-saved-playlists",
    }).catch(() => { /* Ignore errors if background script is not active */ });
  }
}

/**
 * Default application settings.
 */
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

/**
 * Service for handling persistent storage across different environments (Extension vs Web).
 */
export const storageService = {
  /**
   * Fetches an object from storage.
   * @param id The key of the object.
   * @param defaultValue The default value if not found.
   * @returns The fetched object or default value.
   */
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

  /**
   * Stores an object in storage.
   * @param id The key of the object.
   * @param obj The object to store.
   */
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

  /**
   * Fetches all objects from storage.
   * @returns A record of all objects.
   */
  async fetchAllObjects(): Promise<Record<string, any>> {
    if (typeof browser !== "undefined" && browser.storage) {
      return browser.storage.local.get(null);
    } else {
      const all: Record<string, any> = {};
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

  /**
   * Removes an object from storage.
   * @param id The key of the object.
   */
  async removeObject(id: string): Promise<void> {
    if (typeof browser !== "undefined" && browser.storage) {
      await browser.storage.local.remove(id);
    } else {
      localStorage.removeItem(id);
    }
  },

  /**
   * Generates a new unique playlist ID.
   * @returns A promise resolving to the new ID.
   */
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

  /**
   * Generates multiple unique playlist IDs.
   * @param size Number of IDs to generate.
   * @returns A promise resolving to an array of IDs.
   */
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

  /**
   * Saves a playlist to storage.
   * @param playlist The playlist to save.
   * @returns The ID of the saved playlist.
   */
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

    // Emit event
    eventBus.emit(EVENTS.PLAYLIST_SAVED, playlist);

    notifySavedPlaylistsChanged();
    return id;
  },

  /**
   * Retrieves a playlist by ID.
   * @param id The playlist ID.
   * @returns The playlist or null if not found.
   */
  async getPlaylist(id: string): Promise<Playlist | null> {
    const item = await this.fetchObject(PLAYLIST_KEY_PREFIX + id, null);
    if (!item) return null;
    const playlist: Playlist = typeof item === 'string' ? JSON.parse(item) : item;
    playlist.saved = true;
    return playlist;
  },

  /**
   * Retrieves all saved playlists.
   * @returns An array of playlists.
   */
  async getPlaylists(): Promise<Playlist[]> {
    const allItems = await this.fetchAllObjects();
    return Object.keys(allItems)
      .filter((key) => key.startsWith(PLAYLIST_KEY_PREFIX))
      .map((key) => {
        const item = allItems[key];
        const playlist: Playlist = typeof item === 'string' ? JSON.parse(item) : item;
        playlist.saved = true;
        return playlist;
      });
  },

  /**
   * Removes a playlist from storage.
   * @param playlist The playlist to remove.
   */
  async removePlaylist(playlist: Playlist): Promise<void> {
    const key = PLAYLIST_KEY_PREFIX + playlist.id;
    if (!playlist.saved) {
      localStorage.removeItem(key);
    } else {
      await this.removeObject(key);
      eventBus.emit(EVENTS.PLAYLIST_DELETED, playlist.id);
      notifySavedPlaylistsChanged();
    }
  },

  /**
   * Retrieves application settings.
   * @returns The application settings.
   */
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
