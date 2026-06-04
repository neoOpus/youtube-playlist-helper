export type Theme = "light" | "dark" | "black";
export type ThemeChoice = "device" | Theme;
export type UiDensity = "compact" | "normal" | "spacious";
export type AnimationIntensity = "none" | "low" | "full";

export interface Video {
  id: string | number;
  videoId: string;
  url: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  duration?: string;
  durationSeconds?: number;
  aiTags?: string[];
  aiSummary?: string;
}

export interface Playlist {
  id: string;
  title: string;
  videos: string[];
  timestamp: number;
  saved?: boolean;
  lastModified?: number;
}

export interface Settings {
  [id: string]: any;
  themeChoice: ThemeChoice;
  uiDensity: UiDensity;
  animationIntensity: AnimationIntensity;
  sidebarPosition: "left" | "right";
  fontScale: number;
  openPlaylistEditorAfterCreation: boolean;
  autoSaveInterval: number;
  defaultEditorPage: string;
}

export const DEFAULT_SETTINGS: Settings = {
  themeChoice: "device",
  uiDensity: "normal",
  animationIntensity: "full",
  sidebarPosition: "left",
  fontScale: 1.0,
  openPlaylistEditorAfterCreation: true,
  autoSaveInterval: 5,
  defaultEditorPage: "/saved"
};
