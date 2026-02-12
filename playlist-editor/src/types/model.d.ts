export interface Video {
  id: string | number;
  videoId: string;
  url: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  selected?: boolean;
  watched?: boolean;
  notes?: string;
  rating?: number;
  dateAdded?: number;
}

export interface PlaylistExport {
  title: string;
  videos: string[];
  timestamp: number;
}

export interface Playlist {
  id: string;
  title: string;
  loadedVideos?: Video[];
  videos: string[];
  /** Date created */
  timestamp: number;
  saved?: boolean;
  groups?: string[];
}

export interface Settings {
  [id: string]: any;
  openPlaylistEditorAfterCreation: boolean;
  openPlaylistPage: boolean;
  closeAfterCombine: boolean;
  disableThumbnails: boolean;
  openPlaylistBuilderAfterAdd: boolean;
  openSavedPlaylistAfterAdd: boolean;
  defaultEditorPage: "/new" | "/saved";
  saveCreatedPlaylists: boolean;
  disableContextBuilder: boolean;
  disableContextSaved: boolean;
  themeChoice: ThemeChoice;
  viewMode: ViewMode;
}

export type ViewMode = "simple" | "advanced";

export type PlaylistsSorting =
  | "date-created-asc"
  | "date-created-desc"
  | "title-az"
  | "title-za";

export type Theme = "light" | "dark";
export type ThemeChoice = "device" | Theme;
