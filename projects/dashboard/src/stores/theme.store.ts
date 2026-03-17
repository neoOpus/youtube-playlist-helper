import { writable, derived } from "svelte/store";
import { storageService } from "@yph/core";

const themeStorageKey = "theme-choice";

export type ThemeName =
  | "device"
  | "github-light"
  | "github-dark"
  | "dracula"
  | "sota-red";

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
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "github-dark"
      : "github-light";
  }
  return $themeChoice;
});

activeTheme.subscribe(($theme) => {
  document.documentElement.setAttribute("data-theme", $theme);
});
