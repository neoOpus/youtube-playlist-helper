import { writable, derived } from "svelte/store";
import type { Playlist } from "@yph/core";
import { playlistsSorter } from "@yph/core";

export const playlistsSearch = writable("");
export const playlistsSorting = writable("title-asc");

export function createFilteredPlaylists(playlists: Playlist[]) {
    return derived([playlistsSearch, playlistsSorting], ([$search, $sorting]) => {
        let result = [...playlists];

        if ($search.trim()) {
            const query = $search.toLowerCase();
            result = result.filter(pl =>
                pl.title.toLowerCase().includes(query) ||
                (pl.loadedVideos || []).some(v =>
                    v.title.toLowerCase().includes(query) ||
                    (v.aiTags || []).some(t => t.toLowerCase().includes(query))
                )
            );
        }

        const [field, direction] = $sorting.split("-") as [any, any];
        return playlistsSorter.sort(result, field, direction);
    });
}
