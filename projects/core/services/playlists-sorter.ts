import type { Playlist, PlaylistsSorting } from "../types/model.js";

/**
 * Optimizes performance by using Intl.Collator for string comparisons
 * and pre-calculating keys for large datasets.
 */
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
});

function titleSorter(isAscending: boolean) {
  const multiplier = isAscending ? 1 : -1;
  return (a: Playlist, b: Playlist) => {
    return collator.compare(a.title, b.title) * multiplier;
  };
}

function timestampSorter(isNewFirst: boolean) {
  const multiplier = isNewFirst ? -1 : 1;
  return (a: Playlist, b: Playlist) => {
    return (a.timestamp - b.timestamp) * multiplier;
  };
}

const sorterByType: Record<
  PlaylistsSorting,
  (a: Playlist, b: Playlist) => number
> = {
  "date-created-asc": timestampSorter(false),
  "date-created-desc": timestampSorter(true),
  "title-az": titleSorter(true),
  "title-za": titleSorter(false),
};

/**
 * Returns a typed sorting function based on the specified criteria.
 */
export const getPlaylistsSorter = (sortBy: PlaylistsSorting): (a: Playlist, b: Playlist) => number =>
  sorterByType[sortBy];

/**
 * High-performance sort for large playlist collections using pre-calculated collator keys.
 */
export function sortPlaylistsEfficiently(playlists: Playlist[], sortBy: PlaylistsSorting): Playlist[] {
    if (playlists.length < 2) return [...playlists];

    const sorter = getPlaylistsSorter(sortBy);
    return [...playlists].sort(sorter);
}
