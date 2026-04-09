<svelte:options runes={true} />
<script lang="ts">
  import { debounce, playlistsSorter } from "@yph/core";
  import type { Playlist, PlaylistsSorting } from "@yph/core";
  import { SearchIcon, Filter } from "@yph/ui-kit";
  import { playlistsSearch, playlistsSorting } from "../stores/playlists-filters";
  import { fly } from "svelte/transition";

  let {
    playlists = [],
    filteredPlaylists = $bindable([])
  }: {
    playlists?: Playlist[];
    filteredPlaylists: Playlist[];
  } = $props();

  let selectedGroup = $state("All");
  let useRegex = $state(false);
  let searchInVideos = $state(true);
  let showPowerFeatures = $state(false);

  let groups = $derived(["All", ...new Set(playlists.flatMap((p) => p.groups || []))]);

  const debouncedFiltersUpdated = debounce(() => {
    filtersUpdated();
  }, 250);

  function filtersUpdated() {
    if (!playlists) return;

    // ⚡ PERFORMANCE: Filter BEFORE sorting to minimize computational load on sort algorithms.
    let result = [...playlists];

    // 1. Group Filter
    if (selectedGroup !== "All") {
      result = result.filter((p) => p.groups?.includes(selectedGroup));
    }

    // 2. Search Filter
    const searchStr = $playlistsSearch.trim();
    if (searchStr) {
      if (useRegex) {
        try {
          const regex = new RegExp(searchStr, "i");
          result = result.filter(
            (p) => regex.test(p.title || "") ||
                   p.groups?.some((g) => regex.test(g)) ||
                   (searchInVideos && p.loadedVideos?.some(v => regex.test(v.title) || (v.aiTags || []).some(t => regex.test(t))))
          );
        } catch (e) {}
      } else {
        const keywords = searchStr.toLowerCase().split(/\s+/).filter(k => k);
        result = result.filter((p) => {
          const lowerTitle = (p.title || "").toLowerCase();
          const matchesTitle = keywords.every((k) => lowerTitle.includes(k));
          const matchesVideos = searchInVideos && p.loadedVideos?.some(v =>
            keywords.every(k =>
                v.title.toLowerCase().includes(k) ||
                (v.aiTags || []).some(t => t.toLowerCase().includes(k))
            )
          );
          return matchesTitle || matchesVideos;
        });
      }
    }

    // 3. Sorting (Applied to the filtered subset)
    const keywords = searchStr.split(/\s+/).filter((k) => k.length > 2);
    result = playlistsSorter.sort(result, $playlistsSorting, keywords);
    filteredPlaylists = result;
  }

  // Reactive dependencies for automatic filtering when state changes
  $effect(() => {
      playlists;
      $playlistsSorting;
      selectedGroup;
      useRegex;
      searchInVideos;
      filtersUpdated();
  });

  // Search is debounced to avoid expensive filtering on every keystroke
  $effect(() => {
      $playlistsSearch;
      debouncedFiltersUpdated();
  });

  function handleMouseMove(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
  }
</script>

<aside class="pro-glass filters-bar luminous-hover" onmousemove={handleMouseMove}>
  <div class="header-row">
      <div class="stats aura-glow">
        <h2>
          <span class="badge primary">{filteredPlaylists?.length || 0}</span>
          Nodes
        </h2>
      </div>

      <div class="search-box">
          <div class="input-wrapper">
              <SearchIcon size="16" color="var(--primary)" />
              <input
                type="text"
                bind:value={$playlistsSearch}
                placeholder={useRegex ? "Regex Search..." : "Deep Search nodes... (Press /)"}
              />
          </div>
          <button class="power-toggle" class:active={showPowerFeatures} onclick={() => showPowerFeatures = !showPowerFeatures} title="Advanced Filters">
              <Filter size="16" />
          </button>
      </div>

      <div class="filters">
          <label>
            <span>Group</span>
            <select bind:value={selectedGroup}>
              {#each groups as group}
                <option value={group}>{group === 'All' ? 'All Groups' : group}</option>
              {/each}
            </select>
          </label>

          <label>
            <span>Sort</span>
            <select bind:value={$playlistsSorting}>
              <optgroup label="Timeline">
                  <option value="date-created-desc">Recently Created</option>
                  <option value="last-modified-desc">Recently Modified</option>
                  <option value="date-created-asc">Earliest First</option>
              </optgroup>
              <optgroup label="Alphanumeric">
                  <option value="title-az">Name (A-Z)</option>
                  <option value="title-za">Name (Z-A)</option>
              </optgroup>
              <optgroup label="Density">
                  <option value="video-count-desc">Highest Density</option>
                  <option value="video-count-asc">Lowest Density</option>
              </optgroup>
              <optgroup label="Intelligence">
                  <option value="relevance">Smart Relevance</option>
              </optgroup>
            </select>
          </label>
      </div>
  </div>

  {#if showPowerFeatures}
  <div class="power-row" in:fly={{ y: -10, duration: 300 }}>
      <div class="power-options">
          <div class="checks">
              <label class="check-opt">
                  <input type="checkbox" bind:checked={useRegex} />
                  <span>Regex Mode</span>
              </label>
              <label class="check-opt">
                  <input type="checkbox" bind:checked={searchInVideos} />
                  <span>Deep Search</span>
              </label>
          </div>
          <span class="power-hint">Powered by Pro Heuristics.</span>
      </div>
  </div>
  {/if}
</aside>

<style>
  .filters-bar {
    padding: var(--space-4) var(--space-6);
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 50;
    margin-bottom: var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    border: 1px solid var(--border-strong);
    background: var(--card-bg-alpha);
  }

  .header-row { display: flex; align-items: center; justify-content: space-between; gap: var(--space-8); width: 100%; }
  .search-box { flex-grow: 1; display: flex; align-items: center; gap: var(--space-2); max-width: 600px; }

  .input-wrapper {
      position: relative;
      flex-grow: 1;
      display: flex;
      align-items: center;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0 var(--space-4);
      transition: all 0.3s;
  }

  .input-wrapper:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.12); }

  .input-wrapper input {
      border: none;
      background: transparent;
      padding: var(--space-3) var(--space-2);
      width: 100%;
      outline: none;
      font-size: var(--font-sm);
      color: var(--text);
      font-weight: 500;
  }

  .power-toggle {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s;
      color: var(--text-muted);
  }

  .power-toggle.active { background: var(--primary); color: white; border-color: var(--primary); }

  .power-row { padding: var(--space-3) var(--space-5); background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-md); border: 1px dashed var(--border-strong); }
  .power-options { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
  .checks { display: flex; gap: var(--space-8); }
  .check-opt { display: flex; align-items: center; gap: var(--space-3); font-size: var(--font-xs); font-weight: 700; cursor: pointer; }
  .check-opt input { width: 16px; height: 16px; accent-color: var(--primary); }
  .power-hint { font-size: var(--font-xs); color: var(--text-muted); font-weight: 600; opacity: 0.7; font-style: italic; }

  .filters { display: flex; gap: var(--space-4); }

  label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-sm);
      color: var(--text-muted);
  }

  select {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background-color: var(--bg-secondary);
      color: var(--text);
      outline: none;
      font-weight: 700;
      font-size: var(--font-sm);
      cursor: pointer;
  }

  h2 { font-weight: 900; letter-spacing: -0.04em; font-size: var(--font-lg); display: flex; align-items: center; gap: 10px; margin: 0; }

  @media (max-width: 1100px) {
      .header-row { flex-direction: column; align-items: stretch; gap: var(--space-4); }
      .search-box { max-width: none; }
      .filters { justify-content: flex-end; }
  }
</style>
