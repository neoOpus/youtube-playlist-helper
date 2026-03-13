<script lang="ts">
  import { get } from "svelte/store";
  import { getPlaylistsSorter, aiService, debounce } from "@yph/core";
  import {
    playlistsSearch,
    playlistsSorting,
  } from "../stores/playlists-filters";
  import type { Playlist, PlaylistsSorting } from "@yph/core";

  export let playlists: Playlist[] = [];
  export let filteredPlaylists: Playlist[] = [];

  let sortBy = get(playlistsSorting);
  let search = get(playlistsSearch);
  let selectedGroup = "All";
  let useRegex = false;

  $: groups = [
    "All",
    ...new Set((playlists || []).flatMap((p) => p.groups || []).filter(Boolean)),
  ];

  function sortingChanged() {
    playlistsSorting.set(sortBy);
    filtersUpdated();
  }

  const debouncedFiltersUpdated = debounce(() => {
    filtersUpdated();
  }, 300);

  function searchChanged() {
    playlistsSearch.set(search);
    debouncedFiltersUpdated();
  }

  function filtersUpdated() {
    if (!playlists) return;

    let result = [...playlists];

    // 1. Filter by group
    if (selectedGroup !== "All") {
      result = result.filter((p) =>
        p.groups?.includes(selectedGroup)
      );
    }

    // 2. Filter by search
    if (search.trim()) {
        if (useRegex) {
            try {
                const regex = new RegExp(search, "i");
                result = result.filter((p) => regex.test(p.title) || p.groups?.some(g => regex.test(g)));
            } catch (e) {
                // Invalid regex
            }
        } else {
            const keywords = search
              .split(/\s+/)
              .filter((k) => k.length)
              .map((k) => k.toLowerCase());

            result = result.filter((playlist) =>
                keywords.every((k) => playlist.title?.toLowerCase().includes(k))
            );
        }
    }

    // 3. Sort the filtered result
    if (sortBy === "relevance" as any) {
        const keywords = search.split(/\s+/).filter(k => k.length > 2);
        if (keywords.length > 0) {
            // Schwartzian transform: pre-calculate relevance scores
            const scoredResult = result.map((playlist) => ({
                playlist,
                score: aiService.calculatePlaylistRelevance(playlist, keywords)
            }));
            scoredResult.sort((a, b) => b.score - a.score);
            result = scoredResult.map(item => item.playlist);
        }
    } else {
        result.sort(getPlaylistsSorter(sortBy));
    }

    filteredPlaylists = result;
  }

  $: if (playlists) filtersUpdated();
</script>

<aside>
  <div class="header-row">
      <h2 style="margin: 0;">
        {filteredPlaylists?.length || 0} playlist{filteredPlaylists?.length !== 1 ? "s" : ""}
      </h2>

      <div class="search-box">
          <input
            type="text"
            bind:value={search}
            on:input={searchChanged}
            placeholder={useRegex ? "Regex Search..." : "Search playlists..."}
          />
          <label class="regex-toggle">
              <input type="checkbox" bind:checked={useRegex} on:change={filtersUpdated} />
              <span>Regex</span>
          </label>
      </div>

      <div class="filters">
          <label>
            <span>Group</span>
            <select bind:value={selectedGroup} on:change={filtersUpdated}>
              {#each groups as group}
                <option value={group}>{group}</option>
              {/each}
            </select>
          </label>

          <label>
            <span>Sort</span>
            <select bind:value={sortBy} on:change={sortingChanged}>
              <optgroup label="Standard">
                  <option value="date-created-desc">Newest First</option>
                  <option value="date-created-asc">Oldest First</option>
                  <option value="title-az">A-Z</option>
                  <option value="title-za">Z-A</option>
              </optgroup>
              <optgroup label="Intelligence">
                  <option value="relevance">Smart Relevance</option>
              </optgroup>
            </select>
          </label>
      </div>
  </div>
</aside>

<style>
  aside {
    padding: 1.5rem 0;
    position: sticky;
    top: 0;
    background-color: var(--background-color);
    width: 100%;
    z-index: 5;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1rem;
  }

  .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      width: 100%;
  }

  .search-box {
      flex-grow: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 500px;
  }

  .search-box input {
      width: 100%;
  }

  .regex-toggle {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.8rem;
      white-space: nowrap;
  }

  .filters {
      display: flex;
      gap: 1rem;
  }

  label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
  }
</style>
