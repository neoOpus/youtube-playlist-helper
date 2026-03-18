<script lang="ts">
  import { debounce, getPlaylistsSorter, aiService } from "@yph/core";
  import type { Playlist, PlaylistsSorting } from "@yph/core";
  import { SearchIcon, Filter } from "@yph/ui-kit";
  import { playlistsSearch } from "../stores/playlists-filters";

  export let playlists: Playlist[] = [];
  export let filteredPlaylists: Playlist[] = [];

  let search = "";
  let selectedGroup = "All";
  let sortBy: PlaylistsSorting = "date-created-desc";
  let useRegex = false;
  let searchInVideos = false;
  let showPowerFeatures = false;

  $: groups = ["All", ...new Set(playlists.flatMap((p) => p.groups || []))];

  function sortingChanged() {
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

    // 1. Group Filter
    if (selectedGroup !== "All") {
      result = result.filter((p) => p.groups?.includes(selectedGroup));
    }

    // 2. Search Filter
    if (search.trim()) {
      if (useRegex) {
        try {
          const regex = new RegExp(search, "i");
          result = result.filter(
            (p) => regex.test(p.title || "") ||
                   p.groups?.some((g) => regex.test(g)) ||
                   (searchInVideos && p.loadedVideos?.some(v => regex.test(v.title)))
          );
        } catch (e) {
          // Invalid regex
        }
      } else {
        const keywords = search
          .split(/\s+/)
          .filter((k) => k.length)
          .map((k) => k.toLowerCase());

        result = result.filter((p) => {
          const lowerTitle = (p.title || "").toLowerCase();
          const matchesTitle = keywords.every((k) => lowerTitle.includes(k));
          const matchesVideos = searchInVideos && p.loadedVideos?.some(v =>
            keywords.every(k => v.title.toLowerCase().includes(k))
          );
          return matchesTitle || matchesVideos;
        });
      }
    }

    // 3. Sorting
    if (sortBy === ("relevance" as any)) {
      const keywords = search.split(/\s+/).filter((k) => k.length > 2);
      if (keywords.length > 0) {
        const scoredPlaylists = result.map((p) => ({
          p,
          score: aiService.calculatePlaylistRelevance(p, keywords),
        }));
        scoredPlaylists.sort((a, b) => b.score - a.score);
        result = scoredPlaylists.map((item) => item.p);
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
    padding: var(--space-4) 0;
    position: sticky;
    top: 0;
    background-color: transparent;
    width: 100%;
    z-index: 5;
    border-bottom: 1px solid var(--border);
    margin-bottom: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-6);
      width: 100%;
  }

  .search-box {
      flex-grow: 1;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      max-width: 500px;
  }

  .input-wrapper {
      position: relative;
      flex-grow: 1;
      display: flex;
      align-items: center;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0 var(--space-3);
  }

  .input-wrapper:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }

  .input-wrapper input {
      border: none;
      background: transparent;
      padding: var(--space-2) var(--space-3);
      width: 100%;
      outline: none;
      font-size: var(--font-sm);
      color: var(--text);
  }

  .power-toggle {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-2);
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
      padding: var(--space-2) var(--space-4);
      background: var(--hover);
      border-radius: var(--radius-md);
      border: 1px dashed var(--border);
  }

  .power-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
  }

  .checks {
      display: flex;
      gap: var(--space-6);
  }

  .check-opt {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-xs);
      font-weight: 600;
  }

  .power-hint {
      font-size: var(--font-xs);
      color: var(--text-muted);
      font-style: italic;
  }

  .filters {
      display: flex;
      gap: var(--space-4);
  }

  label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-sm);
      color: var(--text-muted);
  }

  select {
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background-color: var(--card-bg);
      color: var(--text);
      outline: none;
  }

  h2 {
      font-weight: 800;
      letter-spacing: -0.02em;
  }

  @media (max-width: 900px) {
      .header-row {
          flex-direction: column;
          align-items: stretch;
      }
      .search-box {
          max-width: none;
      }
  }
</style>
