import { writable, derived } from "svelte/store";
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

function createThemeChoice() {
  const { subscribe, set } = writable<ThemeName>("device");

  return {
    subscribe,
    set: (val: ThemeName) => {
      storageService.storeObject(themeStorageKey, val);
      set(val);
    },
  };
}

export const themeChoice = createThemeChoice();

export async function initTheme() {
  const choice = await storageService.fetchObject(themeStorageKey, "device");
  themeChoice.set(choice as ThemeName);
}

export const activeTheme = derived(themeChoice, ($themeChoice) => {
  if ($themeChoice === "device") {
    if (typeof window === 'undefined') return "github-dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "github-dark"
      : "github-light";
  }
  return $themeChoice;
});

if (typeof document !== 'undefined') {
    activeTheme.subscribe(($theme) => {
        document.documentElement.setAttribute("data-theme", $theme);
    });
}
