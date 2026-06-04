import type { Playlist, Settings } from "../types/model";
import { DEFAULT_SETTINGS } from "../types/model";

const PLAYLIST_KEY_PREFIX = "playlist_";
const ID_COUNTER_KEY = "PlaylistIdCounter";

function playlistToDto(playlist: Playlist) {
  return { ...playlist };
}

export const storageService = {
  async init() {
      // Basic initialization
  },

  async fetchObject(id: string, defaultValue: any): Promise<any> {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return new Promise((resolve) => {
          chrome.storage.local.get(id, (result) => {
              if (result && result[id] != null) {
                  resolve(result[id]);
              } else {
                  resolve(defaultValue);
              }
          });
      });
    } else {
      if (typeof localStorage === 'undefined') return defaultValue;
      const value = localStorage.getItem(id);
      if (value) {
        try { return JSON.parse(value); } catch (e) { return value; }
      }
      return defaultValue;
    }
  },

  async storeObject(id: string, obj: any): Promise<void> {
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.local.set({ [id]: obj });
    } else {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(id, JSON.stringify(obj));
    }
  },

  async fetchAllObjects(): Promise<Record<string, any>> {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return new Promise((resolve) => {
          chrome.storage.local.get(null, (result) => resolve(result || {}));
      });
    } else {
      if (typeof localStorage === 'undefined') return {};
      const all: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const val = localStorage.getItem(key);
            try { all[key] = val ? JSON.parse(val) : val; } catch { all[key] = val; }
        }
      }
      return all;
    }
  },

  async removeObject(id: string): Promise<void> {
    if (typeof chrome !== "undefined" && chrome.storage) await chrome.storage.local.remove(id);
    else if (typeof localStorage !== 'undefined') localStorage.removeItem(id);
  },

  async generatePlaylistId(): Promise<string> {
    let count = await this.fetchObject(ID_COUNTER_KEY, 0);
    count++;
    await this.storeObject(ID_COUNTER_KEY, count);
    return count.toString();
  },

  async savePlaylist(playlist: Playlist): Promise<string> {
    let id = playlist.id;
    if (!id || id === "") id = await this.generatePlaylistId();
    const toSave = { ...playlist, id, timestamp: playlist.timestamp || Date.now() };
    await this.storeObject(PLAYLIST_KEY_PREFIX + id, toSave);
    return id;
  },

  async getPlaylist(id: string): Promise<Playlist | null> {
    const item = await this.fetchObject(PLAYLIST_KEY_PREFIX + id, null);
    return item;
  },

  async getPlaylists(): Promise<Playlist[]> {
    const allItems = await this.fetchAllObjects();
    return Object.keys(allItems)
      .filter((key) => key.startsWith(PLAYLIST_KEY_PREFIX))
      .map((key) => allItems[key]);
  },

  async removePlaylist(playlist: Playlist): Promise<void> {
    await this.removeObject(PLAYLIST_KEY_PREFIX + playlist.id);
  },

  async getSettings(): Promise<Settings> {
    const settings = { ...DEFAULT_SETTINGS };
    const all = await this.fetchAllObjects();
    Object.keys(DEFAULT_SETTINGS).forEach(key => {
        if (all[key] !== undefined) settings[key] = all[key];
    });
    return settings;
  },

  async updateSettings(updates: Partial<Settings>): Promise<void> {
      for (const [key, value] of Object.entries(updates)) {
          await this.storeObject(key, value);
      }
  }
};
