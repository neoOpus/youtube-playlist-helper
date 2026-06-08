<script lang="ts">
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { storageService } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import PlaylistPreview from "../components/PlaylistPreview.svelte";
  import PlaylistsFilters from "../components/PlaylistsFilters.svelte";
  import EmptyState from "../components/EmptyState.svelte";
  import { router } from "../stores/router";
  import { Plus } from "lucide-svelte";

  let playlists = $state<Playlist[]>([]);
  let filteredPlaylists = $state<Playlist[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
        const data = await storageService.getPlaylists();
        playlists = data || [];
        filteredPlaylists = [...playlists];
    } finally {
        loading = false;
    }
  });

  function handleDeleted(pl: Playlist) {
      playlists = playlists.filter(p => p.id !== pl.id);
  }
</script>

<main class="view-container">
  <header class="page-header">
      <div class="header-info">
          <h1>Playlists</h1>
          <p class="text-secondary">Organize your YouTube collections.</p>
      </div>
      <div class="header-actions">
          <button class="primary-btn" onclick={() => router.push('/new')}>
              <Plus size="18" /> Create New
          </button>
      </div>
  </header>

  <PlaylistsFilters {playlists} bind:filteredPlaylists />

  <div class="content-view">
      {#if loading}
          <div class="loading-state">Loading collections...</div>
      {:else if filteredPlaylists.length > 0}
          <div class="grid-container">
              {#each filteredPlaylists as pl (pl.id)}
                  <div animate:flip={{ duration: 200 }}>
                      <PlaylistPreview
                        playlist={pl}
                        ondeleted={handleDeleted}
                      />
                  </div>
              {/each}
          </div>
      {:else}
          <EmptyState
            title="No Playlists Found"
            message="Start by creating your first collection."
            actionLabel="Create One"
            actionClick={() => router.push('/new')}
          />
      {/if}
  </div>
</main>

<style>
  .view-container { max-width: 900px; margin: 0 auto; }
  .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
  }

  h1 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; }
  .text-secondary { font-size: 0.9rem; color: var(--text-secondary); }

  .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.25rem;
  }

  .loading-state { padding: 4rem; text-align: center; color: var(--text-muted); font-weight: 600; }

  .primary-btn {
      background: var(--primary); color: white; border: none; padding: 10px 20px;
      border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;
  }
</style>
