import type { Playlist, Settings } from "../types/model";
import { DEFAULT_SETTINGS } from "../types/model";

const PLAYLIST_KEY_PREFIX = "playlist_";
const ID_COUNTER_KEY = "PlaylistIdCounter";

type StorageChangeListener = (id: string, obj: any) => void | Promise<void>;
const changeListeners: Set<StorageChangeListener> = new Set();

function playlistToDto(playlist: Playlist) {
  const dto = { ...playlist };
  delete dto.loadedVideos;
  return dto;
}

function notifySavedPlaylistsChanged() {
  if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
    chrome.runtime.sendMessage({ cmd: "update-saved-playlists" }).catch(() => {});
  }
}

export const storageService = {
  onSave(listener: StorageChangeListener) {
    changeListeners.add(listener);
  },

  async fetchObject(id: string, defaultValue: any): Promise<any> {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return new Promise((resolve) => {
          chrome.storage.local.get(id, (result) => {
              if (result && result[id] != null) {
                  const val = result[id];
                  if (typeof defaultValue === "number") resolve(+val);
                  else if (typeof defaultValue === "boolean" && typeof val === "string") resolve(val === "true");
                  else resolve(val);
              } else {
                  resolve(defaultValue);
              }
          });
      });
    } else {
      const value = localStorage.getItem(id);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          if (typeof defaultValue === "number") return +parsed;
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
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.local.set({ [id]: value });
    } else {
      if (value === null) localStorage.removeItem(id);
      else localStorage.setItem(id, value);
    }
    for (const listener of changeListeners) await listener(id, obj);
  },

  async fetchAllObjects(): Promise<Record<string, any>> {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return new Promise((resolve) => {
          chrome.storage.local.get(null, (result) => resolve(result || {}));
      });
    } else {
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
    else localStorage.removeItem(id);
  },

  async generatePlaylistId(): Promise<string> {
    const result: any = await this.fetchObject(ID_COUNTER_KEY, 0);
    let count = result || 0;
    count++;
    await this.storeObject(ID_COUNTER_KEY, count);
    return count.toString();
  },

  async savePlaylist(playlist: Playlist): Promise<string> {
    let id = playlist.id;
    if (!playlist.saved) id = await this.generatePlaylistId();
    playlist = { ...playlist, timestamp: playlist.timestamp || Date.now(), id };
    await this.storeObject(PLAYLIST_KEY_PREFIX + id, playlistToDto(playlist));
    notifySavedPlaylistsChanged();
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
        const item = allItems[key];
        const playlist: Playlist = typeof item === 'string' ? JSON.parse(item) : item;
        playlist.saved = true;
        return playlist;
      });
  },

  async removePlaylist(playlist: Playlist): Promise<void> {
    const key = PLAYLIST_KEY_PREFIX + playlist.id;
    await this.removeObject(key);
    notifySavedPlaylistsChanged();
  },

  async getSettings(): Promise<Settings> {
    const settings = { ...DEFAULT_SETTINGS };
    const all = await this.fetchAllObjects();
    Object.keys(DEFAULT_SETTINGS).forEach(key => {
        if (all[key] !== undefined) {
            const val = all[key];
            if (typeof DEFAULT_SETTINGS[key] === 'boolean' && typeof val === 'string') {
                settings[key] = val === 'true';
            } else if (typeof DEFAULT_SETTINGS[key] === 'number') {
                settings[key] = +val;
            } else {
                try { settings[key] = JSON.parse(val); } catch { settings[key] = val; }
            }
        }
    });
    return settings;
  },

  async updateSettings(updates: Partial<Settings>): Promise<void> {
      for (const [key, value] of Object.entries(updates)) {
          await this.storeObject(key, value);
      }
  }
};
