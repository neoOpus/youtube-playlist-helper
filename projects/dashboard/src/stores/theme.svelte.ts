import { storageService } from "@yph/core";

const themeStorageKey = "theme-choice";

export type ThemeName =
  | "device"
  | "github-light"
  | "github-dark"
  | "dracula"
  | "pro-red";

export interface ThemeDef {
    id: ThemeName;
    name: string;
    primary: string;
    accent: string;
}

export const themes: ThemeDef[] = [
    { id: "device", name: "System Default", primary: "#ccc", accent: "#888" },
    { id: "github-light", name: "GitHub Light", primary: "#ffffff", accent: "#0969da" },
    { id: "github-dark", name: "GitHub Dark", primary: "#0d1117", accent: "#2f81f7" },
    { id: "dracula", name: "Dracula Night", primary: "#282a36", accent: "#bd93f9" },
    { id: "pro-red", name: "Pro Red Edition", primary: "#121212", accent: "#ff5252" }
];

export const themeState = $state({
    choice: "device" as ThemeName,
    get active(): ThemeName {
        if (this.choice === "device") {
            if (typeof window === 'undefined') return "github-dark";
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "github-dark"
                : "github-light";
        }
        return this.choice;
    }
});

export async function initTheme() {
    const choice = await storageService.fetchObject(themeStorageKey, "device");
    themeState.choice = choice as ThemeName;
}

export function setTheme(val: ThemeName) {
    storageService.storeObject(themeStorageKey, val);
    themeState.choice = val;
}

// Global theme attribute sync
if (typeof document !== 'undefined') {
    // In Svelte 5 .svelte.ts files, we can use functions that components call,
    // or we can use  if it's within a component context.
    // For global sync, we'll let App.svelte handle it or use a simple watcher if needed.
}
