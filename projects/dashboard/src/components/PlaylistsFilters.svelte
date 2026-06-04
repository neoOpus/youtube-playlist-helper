<script lang="ts">
  import { filtersState } from "../stores/playlists-filters.svelte";
  import { Search, X } from "lucide-svelte";

  let {
    playlists = [],
    filteredPlaylists = $bindable([])
  }: {
    playlists?: any[];
    filteredPlaylists: any[];
  } = $props();

  $effect(() => {
    const query = filtersState.search.trim().toLowerCase();
    if (!query) {
      filteredPlaylists = [...playlists];
    } else {
      filteredPlaylists = playlists.filter(p => p.title.toLowerCase().includes(query));
    }
  });
</script>

<div class="filters-container surface-1">
  <Search size="18" class="icon-muted" />
  <input
    type="text"
    bind:value={filtersState.search}
    placeholder="Filter playlists..."
  />
  {#if filtersState.search}
    <button class="clear-btn" onclick={() => filtersState.search = ""}><X size="14" /></button>
  {/if}
</div>

<style>
  .filters-container {
    display: flex; align-items: center; padding: 0.5rem 1rem; gap: 0.75rem;
    margin-bottom: 1.5rem; border-radius: 10px;
  }
  :global(.icon-muted) { color: var(--text-muted); }
  input {
    flex: 1; background: transparent; border: none; padding: 0.5rem 0;
    color: var(--text-main); font-weight: 500; outline: none;
  }
  .clear-btn {
    background: var(--bg-surface-2); border: none; color: var(--text-muted);
    width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  }
</style>
