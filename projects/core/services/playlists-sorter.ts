import type { Playlist, PlaylistsSorting } from "../types/model.js";
import { aiService } from "./ai-service.js";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
});

function titleSorter(isAscending: boolean) {
  const multiplier = isAscending ? 1 : -1;
  return (a: Playlist, b: Playlist) => {
    return (collator.compare(a.title, b.title) || (a.timestamp - b.timestamp)) * multiplier;
  };
}

function timestampSorter(isNewFirst: boolean) {
  const multiplier = isNewFirst ? -1 : 1;
  return (a: Playlist, b: Playlist) => {
    return (a.timestamp - b.timestamp) * multiplier || collator.compare(a.title, b.title);
  };
}

function videoCountSorter(isDesc: boolean) {
    const multiplier = isDesc ? -1 : 1;
    return (a: Playlist, b: Playlist) => {
        const countA = (a.videos || []).length;
        const countB = (b.videos || []).length;
        return (countA - countB) * multiplier || collator.compare(a.title, b.title);
    };
}

function lastModifiedSorter() {
    return (a: Playlist, b: Playlist) => {
        const timeA = a.lastModified || a.timestamp;
        const timeB = b.lastModified || b.timestamp;
        return (timeB - timeA) || collator.compare(a.title, b.title);
    };
}

const sorterByType: Record<
  Exclude<PlaylistsSorting, "relevance">,
  (a: Playlist, b: Playlist) => number
> = {
  "date-created-asc": timestampSorter(false),
  "date-created-desc": timestampSorter(true),
  "title-az": titleSorter(true),
  "title-za": titleSorter(false),
  "video-count-asc": videoCountSorter(false),
  "video-count-desc": videoCountSorter(true),
  "last-modified-desc": lastModifiedSorter(),
};

export const playlistsSorter = {
  sort(playlists: Playlist[], sortBy: PlaylistsSorting, keywords: string[] = []): Playlist[] {
    if (sortBy === "relevance") {
      const normalizedKeywords = (keywords || []).map(k => k.toLowerCase());
      if (normalizedKeywords.length === 0) {
          return [...playlists].sort(sorterByType["date-created-desc"]);
      }

      return playlists
        .map(playlist => ({
            playlist,
            score: aiService.calculatePlaylistRelevance(playlist, normalizedKeywords)
        }))
        .sort((a, b) => b.score - a.score || (b.playlist.timestamp - a.playlist.timestamp))
        .map(pair => pair.playlist);
    }

    return [...playlists].sort(sorterByType[sortBy as Exclude<PlaylistsSorting, "relevance">]);
  }
};

/**
 * @deprecated Use playlistsSorter.sort instead.
 */
export const getPlaylistsSorter = (sortBy: PlaylistsSorting) => {
    if (sortBy === "relevance") return () => 0;
    return sorterByType[sortBy as Exclude<PlaylistsSorting, "relevance">];
};

export function sortPlaylistsEfficiently(playlists: Playlist[], sortBy: PlaylistsSorting): Playlist[] {
    if (playlists.length < 2) return [...playlists];
    return playlistsSorter.sort(playlists, sortBy);
}
