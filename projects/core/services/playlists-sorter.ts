import type { Playlist, PlaylistsSorting } from "../types/model.js";
import { aiService } from "./ai-service.js";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function titleSorter(isAscending: boolean) {
  const multiplier = isAscending ? 1 : -1;
  return (a: Playlist, b: Playlist) => {
    return (
      (collator.compare(a.title || "", b.title || "") ||
        a.timestamp - b.timestamp) * multiplier
    );
  };
}

function timestampSorter(isNewFirst: boolean) {
  const multiplier = isNewFirst ? -1 : 1;
  return (a: Playlist, b: Playlist) => {
    return (
      (a.timestamp - b.timestamp) * multiplier ||
      collator.compare(a.title || "", b.title || "")
    );
  };
}

function videoCountSorter(isDesc: boolean) {
  const multiplier = isDesc ? -1 : 1;
  return (a: Playlist, b: Playlist) => {
    const countA = (a.videos || []).length;
    const countB = (b.videos || []).length;
    return (
      (countA - countB) * multiplier ||
      collator.compare(a.title || "", b.title || "")
    );
  };
}

function lastModifiedSorter() {
  return (a: Playlist, b: Playlist) => {
    const timeA = a.lastModified || a.timestamp;
    const timeB = b.lastModified || b.timestamp;
    return timeB - timeA || collator.compare(a.title || "", b.title || "");
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
  /**
   * Sorts an array of playlists based on the specified criteria.
   * Supports ASYNC sorting for relevance if AI expansion is needed.
   */
  async sort(
    playlists: Playlist[],
    sortBy: PlaylistsSorting,
    keywords: string[] = []
  ): Promise<Playlist[]> {
    if (sortBy === "relevance") {
      if (!keywords.length) {
        return [...playlists].sort(sorterByType["date-created-desc"]);
      }

      // ⚡ PERFORMANCE: Expand keywords ONCE per sort session, not per comparison.
      const expandedKeywords = await aiService.expandKeywords(keywords);

      return playlists
        .map((playlist) => ({
          playlist,
          score: aiService.calculatePlaylistRelevance(
            playlist,
            expandedKeywords
          ),
        }))
        .sort(
          (a, b) =>
            b.score - a.score || b.playlist.timestamp - a.playlist.timestamp
        )
        .map((pair) => pair.playlist);
    }

    const sorter = sorterByType[sortBy as keyof typeof sorterByType];
    return sorter ? [...playlists].sort(sorter) : [...playlists];
  },
};
