import type { ViewMode } from "@yph/core";
import { storageService } from "@yph/core";

const viewModeStorageKey = "viewMode";

class ViewModeState {
    current = $state<ViewMode>("simple");

    constructor() {
        storageService
            .fetchObject(viewModeStorageKey, "simple")
            .then((val) => {
                if (val) this.current = val as ViewMode;
            });
    }

    set(val: ViewMode) {
        this.current = val;
        storageService.storeObject(viewModeStorageKey, val);
    }

    toggle() {
        const next = this.current === "simple" ? "advanced" : "simple";
        this.set(next);
    }
}

export const viewMode = new ViewModeState();
