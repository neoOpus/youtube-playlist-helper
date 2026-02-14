import type { Playlist, Settings, PlaylistExport } from "./model";

export interface Window {
  videoService: any;
  videoIdCount: number;
  youtubeRegexPattern: string;
  generatePlaylistId: () => Promise<string>;
  generatePlaylistIds: (size: number) => Promise<string[]>;
  fetchObject: (id: string, defaultValue: any) => Promise<any>;
  storeObject: (id: string, obj: any) => Promise<void>;
  fetchAllObjects: () => Promise<Record<string, any>>;
  removeObject: (id: string) => Promise<void>;
  getSettings: () => Promise<Settings>;
  getPlaylists: () => Promise<Playlist[]>;
  getPlaylist: (id: string) => Promise<Playlist | null>;
  savePlaylist: (playlist: Playlist) => Promise<string>;
  removePlaylist: (playlist: Playlist) => Promise<void>;
  removeSavedPlaylists: () => Promise<void>;
  importPlaylists: (playlistsExport: PlaylistExport[]) => Promise<void>;
  error: (message: string) => () => void;
  success: (message: string) => () => void;
  info: (message: string) => () => void;
}
