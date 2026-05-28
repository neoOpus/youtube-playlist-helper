import type { PlaylistsSorting } from "@yph/core";
import { storageService } from "@yph/core";

const defaultPlaylistsSorting: PlaylistsSorting = "date-created-desc";
const playlistsSortingStorageKey = "playlists-sorting";

class PlaylistsFiltersState {
    sorting = $state<PlaylistsSorting>(defaultPlaylistsSorting);
    search = $state("");

    constructor() {
        storageService
            .fetchObject(playlistsSortingStorageKey, defaultPlaylistsSorting)
            .then((sorting) => {
                if (sorting) this.sorting = sorting;
            });
    }

    setSorting(sorting: PlaylistsSorting) {
        this.sorting = sorting;
        storageService.storeObject(playlistsSortingStorageKey, sorting);
    }
}

export const playlistsFilters = new PlaylistsFiltersState();
