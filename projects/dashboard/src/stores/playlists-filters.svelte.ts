import { storageService } from "@yph/core";
import type { PlaylistsSorting } from "@yph/core";

const sortingStorageKey = "playlists-sorting";
const defaultSorting: PlaylistsSorting = "date-created-desc";

function createFiltersState() {
    let search = $state("");
    let sorting = $state<PlaylistsSorting>(defaultSorting);
    let group = $state("All");

    storageService
        .fetchObject(sortingStorageKey, defaultSorting)
        .then((val) => {
            if (val) sorting = val as PlaylistsSorting;
        });

    return {
        get search() { return search; },
        set search(v: string) { search = v; },

        get sorting() { return sorting; },
        set sorting(v: PlaylistsSorting) {
            sorting = v;
            storageService.storeObject(sortingStorageKey, v);
        },

        get group() { return group; },
        set group(v: string) { group = v; }
    };
}

export const filtersState = createFiltersState();

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
