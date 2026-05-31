import type { ViewMode } from "@yph/core";
import { storageService } from "@yph/core";

const viewModeStorageKey = "viewMode";

function createViewMode() {
    let mode = $state<ViewMode>("simple");

    storageService
        .fetchObject(viewModeStorageKey, "simple")
        .then((val) => {
            if (val) mode = val as ViewMode;
        });

    return {
        get value() { return mode; },
        set: (val: ViewMode) => {
            mode = val;
            storageService.storeObject(viewModeStorageKey, val);
        },
        toggle: () => {
            const next = mode === "simple" ? "advanced" : "simple";
            mode = next;
            storageService.storeObject(viewModeStorageKey, next);
        }
    };
}

export const viewMode = createViewMode();
