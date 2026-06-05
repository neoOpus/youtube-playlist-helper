import { playlistsSorter } from "@yph/core";
import type { PlaylistsSorting } from "@yph/core";

export const filtersState = $state({
    search: "",
    sorting: "date-created-desc" as PlaylistsSorting,
    group: "All"
});

export const playlistsSearch = {
    get value() { return filtersState.search; },
    set: (v: string) => filtersState.search = v
};

export const playlistsSorting = {
    get value() { return filtersState.sorting; },
    set: (v: PlaylistsSorting) => filtersState.sorting = v
};

export const playlistsGroupFilter = {
    get value() { return filtersState.group; },
    set: (v: string) => filtersState.group = v
};
