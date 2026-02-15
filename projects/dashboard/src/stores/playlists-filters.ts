import { writable } from "svelte/store";
import type { PlaylistsSorting } from "@yph/core";
import { storageService } from "@yph/core";

const defaultPlaylistsSorting: PlaylistsSorting = "date-created-desc";
const playlistsSortingStorageKey = "playlists-sorting";

function createPlaylistsSorting() {
  const { subscribe, set } = writable<PlaylistsSorting>(
    defaultPlaylistsSorting
  );

  storageService
    .fetchObject(playlistsSortingStorageKey, defaultPlaylistsSorting)
    .then((sorting) => set(sorting));

  return {
    subscribe,
    set: (sorting: PlaylistsSorting) => {
      storageService.storeObject(playlistsSortingStorageKey, sorting);
      set(sorting);
    },
  };
}

export const playlistsSorting = createPlaylistsSorting();

export const playlistsSearch = writable("");
