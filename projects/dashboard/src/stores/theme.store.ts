import { writable, derived } from "svelte/store";
import type { Theme, ThemeChoice } from "@yph/core";
import { storageService } from "@yph/core";

const themeStorageKey = "theme-choice";

function createThemeChoice() {
  const { subscribe, set } = writable<ThemeChoice>("device");

  return {
    subscribe,
    set: (themeChoice: ThemeChoice) => {
      storageService.storeObject(themeStorageKey, themeChoice);
      set(themeChoice);
    },
  };
}

export const themeChoice = createThemeChoice();

export async function initTheme() {
  const choice = await storageService
    .fetchObject(themeStorageKey, "device");
    themeChoice.set(choice);
}

export const theme = derived(themeChoice, ($themeChoice) => {
  if ($themeChoice === "device") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return $themeChoice as Theme;
});

theme.subscribe(($theme) => {
  document.documentElement.setAttribute("data-theme", $theme);
});
