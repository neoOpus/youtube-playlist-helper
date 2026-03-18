<script lang="ts">
  import { get } from "svelte/store";
  import { getPlaylistsSorter, aiService, debounce } from "@yph/core";
  import {
    playlistsSearch,
    playlistsSorting,
  } from "../stores/playlists-filters";
  import type { Playlist, PlaylistsSorting } from "@yph/core";
  import { Filter, SearchIcon } from "@yph/ui-kit";

  export let playlists: Playlist[] = [];
  export let filteredPlaylists: Playlist[] = [];

  let sortBy: PlaylistsSorting = get(playlistsSorting);
  let search = get(playlistsSearch);
  let selectedGroup = "All";
  let useRegex = false;
  let searchInVideos = false;
  let showPowerFeatures = false;

  $: groups = [
    "All",
    ...new Set((playlists || []).flatMap((p) => p.groups || []).filter(Boolean)),
  ];

  function sortingChanged() {
    playlistsSorting.set(sortBy);
    filtersUpdated();
  }

  const debouncedSearchChanged = debounce(() => {
    playlistsSearch.set(search);
    filtersUpdated();
  }, 300);

  function searchChanged() {
    debouncedSearchChanged();
  const debouncedFiltersUpdated = debounce(() => {
    filtersUpdated();
  }, 300);

  function searchChanged() {
    playlistsSearch.set(search);
    debouncedFiltersUpdated();
  }

  function filtersUpdated() {
    if (!playlists) return;

    // ⚡ PERFORMANCE: Filter BEFORE sorting to minimize computational load on sort algorithms.
    // O(M) where M is total playlists.
    let result = [...playlists];

    // 1. Group Filter
    // 1. Filter by group
    if (selectedGroup !== "All") {
      result = result.filter((p) => p.groups?.includes(selectedGroup));
    }

    // 2. Search Filter
    if (search.trim()) {
      if (useRegex) {
        try {
          const regex = new RegExp(search, "i");
          result = result.filter(
            (p) => regex.test(p.title) || p.groups?.some((g) => regex.test(g))
          );
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

    // 3. Sorting (Applied to the filtered subset)
    // ⚡ PERFORMANCE: O(N log N) where N is the size of the filtered result (N <= M).
    if (sortBy === ("relevance" as any)) {
      const keywords = search.split(/\s+/).filter((k) => k.length > 2);
      if (keywords.length > 0) {
        // ⚡ PERFORMANCE: Schwartzian transform (pre-calculating sort scores)
        // prevents redundant expensive AI relevance calculations during sort.
        const scoredPlaylists = result.map((p) => ({
          p,
          score: aiService.calculatePlaylistRelevance(p, keywords),
        }));
        scoredPlaylists.sort((a, b) => b.score - a.score);
        result = scoredPlaylists.map((item) => item.p);
      }
    } else {
      result.sort(getPlaylistsSorter(sortBy));
    // 2. Filter by search
    if (search.trim()) {
        const query = search.toLowerCase();
        if (useRegex) {
            try {
                const regex = new RegExp(search, "i");
                result = result.filter((p) =>
                    regex.test(p.title) ||
                    p.groups?.some(g => regex.test(g)) ||
                    (searchInVideos && p.loadedVideos?.some(v => regex.test(v.title)))
                );
            } catch (e) { /* Invalid regex */ }
        } else {
            const keywords = search
              .split(/\s+/)
              .filter((k) => k.length)
              .map((k) => k.toLowerCase());

            result = result.filter((playlist) => {
                const lowerTitle = playlist.title?.toLowerCase() || "";
                return keywords.every((k) => lowerTitle.includes(k));
            const keywords = search.split(/\s+/).filter((k) => k.length).map((k) => k.toLowerCase());

            result = result.filter((p) => {
                const matchesTitle = keywords.every((k) => p.title?.toLowerCase().includes(k));
                const matchesVideos = searchInVideos && p.loadedVideos?.some(v =>
                    keywords.every(k => v.title.toLowerCase().includes(k))
                );
                return matchesTitle || matchesVideos;
            });
        }
    }

    // 3. Sort the filtered result
    if (sortBy === "relevance") {
        const keywords = search.split(/\s+/).filter(k => k.length > 2);
        if (keywords.length > 0) {
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

    // 3. Sort the filtered result
    if (sortBy === "relevance" as any) {
        const keywords = search.split(/\s+/).filter(k => k.length > 2).map(k => k.toLowerCase());
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
      <div class="stats">
        <h2 style="margin: 0;">
          {filteredPlaylists?.length || 0} playlist{filteredPlaylists?.length !== 1 ? "s" : ""}
        </h2>
      </div>

      <div class="search-box">
          <div class="input-wrapper">
              <SearchIcon size="16" color="var(--text-muted)" />
              <input
                type="text"
                bind:value={search}
                on:input={searchChanged}
                placeholder={useRegex ? "Regex Search..." : "Search playlists... (Press / to focus)"}
              />
          </div>
          <button class="power-toggle" class:active={showPowerFeatures} on:click={() => showPowerFeatures = !showPowerFeatures} title="Advanced Filters">
              <Filter size="16" />
          </button>
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
              {#if showPowerFeatures}
              <optgroup label="Intelligence">
                  <option value="relevance">Smart Relevance</option>
              </optgroup>
              {/if}
            </select>
          </label>
      </div>
  </div>

  {#if showPowerFeatures}
  <div class="power-row">
      <div class="power-options">
          <div class="checks">
              <label class="check-opt">
                  <input type="checkbox" bind:checked={useRegex} on:change={filtersUpdated} />
                  <span>Regex Mode</span>
              </label>
              <label class="check-opt">
                  <input type="checkbox" bind:checked={searchInVideos} on:change={filtersUpdated} />
                  <span>Deep Search (in videos)</span>
              </label>
          </div>
          <span class="power-hint">Powered by Multi-Signal Heuristics and AI Smart Sort.</span>
      </div>
  </div>
  {/if}
</aside>

<style>
  aside {
    padding: 1rem 0;
    position: sticky;
    top: 0;
    background-color: transparent;
    width: 100%;
    z-index: 5;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

  .input-wrapper {
      position: relative;
      flex-grow: 1;
      display: flex;
      align-items: center;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0 12px;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
  }

  .input-wrapper:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }

  .input-wrapper input {
      border: none;
      background: transparent;
      padding: 8px 12px;
      width: 100%;
      outline: none;
      font-size: 0.95rem;
      color: var(--text);
  }

  .power-toggle {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s;
      color: var(--text-muted);
  }

  .power-toggle:hover {
      background: var(--hover);
      color: var(--text);
  }

  .power-toggle.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
  }

  .power-row {
      padding: 0.5rem 1rem;
      background: var(--hover);
      border-radius: 8px;
      border: 1px dashed var(--border);
  }

  .power-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
  }

  .checks {
      display: flex;
      gap: 1.5rem;
  }

  .check-opt {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 600;
  }

  .power-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-style: italic;
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
      color: var(--text-muted);
  }

  select {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background-color: var(--card-bg);
      color: var(--text);
      outline: none;
  }

  h2 {
      font-weight: 800;
      letter-spacing: -0.5px;
  }
</style>
