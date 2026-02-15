import { derived, get, readable, writable, type Readable } from "svelte/store";
import type { Theme, ThemeChoice } from "../types/model.js";

const themeStorageKey = "themeChoice";

export const themeStore = writable<ThemeChoice>("device");

export const currentTheme: Readable<Theme> = derived(themeStore, ($theme) =>
  $theme == "device"
    ? window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : $theme as Theme
);

function updatePageTheme() {
  document.documentElement.dataset.theme = get(currentTheme);
}

export function initTheme() {
  window
    .fetchObject(themeStorageKey, "device")
    .then((themeChoice: ThemeChoice) => {
      themeStore.set(themeChoice);
      themeStore.subscribe((val) => {
        window.storeObject(themeStorageKey, val);
        updatePageTheme();
      });
      updatePageTheme();
    });
}
