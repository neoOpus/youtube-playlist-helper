import { writable } from "svelte/store";
import type { ViewMode } from "@yph/core";
import { storageService } from "@yph/core";

const viewModeStorageKey = "viewMode";

function createViewMode() {
  const { subscribe, set, update } = writable<ViewMode>("simple");

  storageService
    .fetchObject(viewModeStorageKey, "simple")
    .then((val) => {
        if (val) set(val as ViewMode);
    });

  return {
    subscribe,
    set: (val: ViewMode) => {
      storageService.storeObject(viewModeStorageKey, val);
      set(val);
    },
    toggle: () => {
      update((current) => {
        const next = current === "simple" ? "advanced" : "simple";
        storageService.storeObject(viewModeStorageKey, next);
        return next;
      });
    }
  };
}

export const viewMode = createViewMode();
