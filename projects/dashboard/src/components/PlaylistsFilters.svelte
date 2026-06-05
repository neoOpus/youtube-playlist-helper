<svelte:options runes={true} />
<script lang="ts">
  import { debounce, playlistsSorter } from "@yph/core";
  import type { Playlist, PlaylistsSorting } from "@yph/core";
  import { filtersState } from "../stores/playlists-filters";
  import { fade, fly } from "svelte/transition";
  import { Search, SlidersHorizontal, Cpu, X } from "lucide-svelte";

  let {
    playlists = [],
    filteredPlaylists = $bindable([])
  }: {
    playlists?: Playlist[];
    filteredPlaylists: Playlist[];
  } = $props();

  let useRegex = $state(false);
  let searchInVideos = $state(true);
  let showAdvanced = $state(false);

  let groups = $derived(["All", ...new Set(playlists.flatMap((p) => p.groups || []))]);

  function applyFilters() {
    if (!playlists) return;
    let result = [...playlists];

    if (filtersState.group !== "All") {
      result = result.filter((p) => p.groups?.includes(filtersState.group));
    }

    const query = filtersState.search.trim().toLowerCase();
    if (query) {
      if (useRegex) {
        try {
          const regex = new RegExp(query, "i");
          result = result.filter(p => regex.test(p.title) || (searchInVideos && p.loadedVideos?.some(v => regex.test(v.title))));
        } catch {}
      } else {
        result = result.filter(p => p.title.toLowerCase().includes(query) || (searchInVideos && p.loadedVideos?.some(v => v.title.toLowerCase().includes(query))));
      }
    }

    result = playlistsSorter.sort(result, filtersState.sorting, query.split(/\s+/).filter(k => k.length > 2));
    filteredPlaylists = result;
  }

  $effect(() => {
      playlists; filtersState.sorting; filtersState.group; filtersState.search;
      applyFilters();
  });
</script>

<div class="filters-container">
  <div class="main-bar surface-1">
      <div class="search-area">
          <Search size="18" class="search-icon" />
          <input
            type="text"
            bind:value={filtersState.search}
            placeholder="Search collections..."
          />
          {#if filtersState.search}
            <button class="clear-btn" onclick={() => filtersState.search = ""}><X size="14" /></button>
          {/if}
      </div>

      <div class="divider"></div>

      <div class="selectors">
          <div class="select-wrap">
              <span class="label">GROUP</span>
              <select bind:value={filtersState.group}>
                  {#each groups as g}
                    <option value={g}>{g.toUpperCase()}</option>
                  {/each}
              </select>
          </div>

          <div class="select-wrap">
              <span class="label">SORT</span>
              <select bind:value={filtersState.sorting}>
                  <option value="date-created-desc">RECENT</option>
                  <option value="last-modified-desc">MODIFIED</option>
                  <option value="relevance">RELEVANCE</option>
                  <option value="video-count-desc">DENSITY</option>
              </select>
          </div>
      </div>

      <button class="toggle-btn" class:active={showAdvanced} onclick={() => showAdvanced = !showAdvanced}>
          <SlidersHorizontal size="18" />
      </button>
  </div>

  {#if showAdvanced}
    <div class="advanced-panel surface-1" in:fly={{ y: -10, duration: 200 }}>
        <div class="options">
            <label class="check-label">
                <input type="checkbox" bind:checked={useRegex} />
                <span>Regex Protocol</span>
            </label>
            <label class="check-label">
                <input type="checkbox" bind:checked={searchInVideos} />
                <span>Recursive Scan</span>
            </label>
        </div>
        <div class="info">
            <Cpu size="12" />
            <span>HEURISTICS_V4_ACTIVE</span>
        </div>
    </div>
  {/if}
</div>

<style>
  .filters-container { display: flex; flex-direction: column; gap: 8px; position: sticky; top: var(--ui-padding); z-index: 100; margin-bottom: 24px; }
  .main-bar { display: flex; align-items: center; padding: 4px; gap: 4px; box-shadow: var(--shadow-md); border-radius: 12px; }
  .search-area { flex: 1; display: flex; align-items: center; padding: 0 12px; gap: 12px; }
  :global(.search-icon) { color: var(--text-muted); }
  input { flex: 1; background: transparent; border: none; padding: 10px 0; color: var(--text-main); font-weight: 600; outline: none; font-size: 0.95rem; }
  .clear-btn { background: var(--bg-surface-2); border: none; color: var(--text-muted); padding: 4px; border-radius: 50%; cursor: pointer; display: flex; }
  .divider { width: 1px; height: 24px; background: var(--border-base); margin: 0 8px; }
  .selectors { display: flex; gap: 16px; padding-right: 12px; }
  .select-wrap { display: flex; flex-direction: column; gap: 2px; }
  .label { font-size: 0.55rem; font-weight: 800; color: var(--text-dim); letter-spacing: 0.05em; }
  select { background: transparent; border: none; color: var(--text-main); font-weight: 700; font-size: 0.75rem; outline: none; cursor: pointer; padding: 0; }
  .toggle-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: none; background: transparent; color: var(--text-muted); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
  .toggle-btn:hover { background: var(--bg-surface-2); color: var(--text-main); }
  .toggle-btn.active { color: var(--primary); background: rgba(var(--primary-rgb), 0.1); }
  .advanced-panel { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 10px; border-color: var(--border-subtle); }
  .options { display: flex; gap: 24px; }
  .check-label { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
  .check-label input { accent-color: var(--primary); }
  .info { display: flex; align-items: center; gap: 6px; font-size: 0.6rem; font-weight: 800; color: var(--text-dim); letter-spacing: 0.05em; }
  @media (max-width: 900px) { .main-bar { flex-wrap: wrap; padding: 12px; } .search-area { width: 100%; flex: none; border-bottom: 1px solid var(--border-base); margin-bottom: 8px; } .divider { display: none; } }
</style>
