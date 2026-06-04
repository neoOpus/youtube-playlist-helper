import { storageService } from "@yph/core";
import type { Theme, ThemeChoice, UiDensity, AnimationIntensity, Settings } from "@yph/core";

interface AppState {
    theme: Theme;
    choice: ThemeChoice;
    density: UiDensity;
    animation: AnimationIntensity;
    sidebar: "left" | "right";
    fontScale: number;
    defaultEditorPage: string;
    openPlaylistEditorAfterCreation: boolean;
    autoSaveInterval: number;
}

export const appState = $state<AppState>({
    theme: "dark",
    choice: "device",
    density: "normal",
    animation: "full",
    sidebar: "left",
    fontScale: 1.0,
    defaultEditorPage: "/saved",
    openPlaylistEditorAfterCreation: true,
    autoSaveInterval: 5
});

export async function initAppState() {
    await storageService.init();
    const settings = await storageService.getSettings();
    updateFromSettings(settings);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
        if (appState.choice === "device") {
            appState.theme = media.matches ? "dark" : "light";
        }
    };
    media.addEventListener("change", updateTheme);
    updateTheme();
}

function updateFromSettings(settings: Settings) {
    appState.choice = settings.themeChoice;
    appState.density = settings.uiDensity;
    appState.animation = settings.animationIntensity;
    appState.sidebar = settings.sidebarPosition;
    appState.fontScale = settings.fontScale;
    appState.defaultEditorPage = settings.defaultEditorPage;
    appState.openPlaylistEditorAfterCreation = settings.openPlaylistEditorAfterCreation;
    appState.autoSaveInterval = settings.autoSaveInterval;

    if (settings.themeChoice !== "device") {
        appState.theme = settings.themeChoice as Theme;
    }
}

export async function updatePreference<K extends keyof Settings>(key: K, value: Settings[K]) {
    await storageService.updateSettings({ [key]: value });
    const settings = await storageService.getSettings();
    updateFromSettings(settings);
}

export function setTheme(choice: ThemeChoice) {
    updatePreference("themeChoice", choice);
}
