export type Theme = "light" | "dark" | "black";
export type ThemeChoice = "device" | Theme;
export type ViewMode = "simple" | "advanced" | "compact";
export type UiDensity = "compact" | "normal" | "spacious";
export type AnimationIntensity = "none" | "low" | "full";

export type PlaylistsSorting =
  | "date-created-asc"
  | "date-created-desc"
  | "title-az"
  | "title-za"
  | "relevance"
  | "video-count-desc"
  | "video-count-asc"
  | "last-modified-desc";

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
  aiSummary?: string;
  aiTags?: string[];
  duration?: string;
  author?: string;
  views?: string;
  publishedDate?: string;
  energyVibe?: 'Chill' | 'Productive' | 'Intense' | 'Educational' | 'Inspirational' | 'Deep Focus';
}

export interface Playlist {
  id: string;
  title: string;
  loadedVideos?: Video[];
  videos: string[];
  timestamp: number;
  saved?: boolean;
  groups?: string[];
  lastModified?: number;
}

export interface Settings {
  [id: string]: any;
  // --- UI & Appearance ---
  themeChoice: ThemeChoice;
  viewMode: ViewMode;
  uiDensity: UiDensity;
  animationIntensity: AnimationIntensity;
  sidebarPosition: "left" | "right";
  accentColorOverride?: string;
  fontScale: number; // 0.8 to 1.2

  // --- Navigation & Workflow ---
  openPlaylistEditorAfterCreation: boolean;
  openPlaylistPage: boolean;
  closeAfterCombine: boolean;
  openPlaylistBuilderAfterAdd: boolean;
  openSavedPlaylistAfterAdd: boolean;
  defaultEditorPage: "/new" | "/saved";
  saveCreatedPlaylists: boolean;

  // --- Logic & Data ---
  disableThumbnails: boolean;
  disableContextBuilder: boolean;
  disableContextSaved: boolean;
  autoSaveInterval: number; // minutes
  enableDeepScanByDefault: boolean;
  notificationVerbosity: "none" | "minimal" | "all";

  // --- Performance ---
  reducedMotion: boolean;
  lowPowerMode: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  themeChoice: "device",
  viewMode: "simple",
  uiDensity: "normal",
  animationIntensity: "full",
  sidebarPosition: "left",
  fontScale: 1.0,
  openPlaylistEditorAfterCreation: true,
  openPlaylistPage: false,
  closeAfterCombine: false,
  openPlaylistBuilderAfterAdd: true,
  openSavedPlaylistAfterAdd: true,
  defaultEditorPage: "/saved",
  saveCreatedPlaylists: false,
  disableThumbnails: false,
  disableContextBuilder: false,
  disableContextSaved: false,
  autoSaveInterval: 5,
  enableDeepScanByDefault: false,
  notificationVerbosity: "all",
  reducedMotion: false,
  lowPowerMode: false
};
