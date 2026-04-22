import { storageService } from "@yph/core";
import type { Theme, ThemeChoice, UiDensity, AnimationIntensity, Settings } from "@yph/core";

interface AppState {
    theme: Theme;
    choice: ThemeChoice;
    density: UiDensity;
    animation: AnimationIntensity;
    sidebar: "left" | "right";
    fontScale: number;
    reducedMotion: boolean;
}

export const appState = $state<AppState>({
    theme: "dark",
    choice: "device",
    density: "normal",
    animation: "full",
    sidebar: "left",
    fontScale: 1.0,
    reducedMotion: false
});

export const themes = [
  { id: "light", name: "Modern Light", primary: "#3b82f6", bg: "#f8fafc" },
  { id: "dark", name: "Obsidian Night", primary: "#3b82f6", bg: "#0f172a" },
  { id: "black", name: "OLED Black", primary: "#10b981", bg: "#000000" }
];

export async function initAppState() {
    const settings = await storageService.getSettings();
    updateFromSettings(settings);

    // Watch for device theme changes
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
    appState.reducedMotion = settings.reducedMotion;

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
