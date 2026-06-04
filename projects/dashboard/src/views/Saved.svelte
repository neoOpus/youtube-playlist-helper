<script lang="ts">
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { storageService } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import PlaylistPreview from "../components/PlaylistPreview.svelte";
  import PlaylistsFilters from "../components/PlaylistsFilters.svelte";
  import EmptyState from "../components/EmptyState.svelte";
  import { SuperButton } from "@yph/ui-kit";
  import { router } from "../stores/router";

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
          <h1>Your Playlists</h1>
          <p class="text-secondary">Organize and manage your YouTube collections.</p>
      </div>
      <div class="header-actions">
          <SuperButton primary onclick={() => router.push('/new')}>Create New</SuperButton>
      </div>
  </header>

  <PlaylistsFilters {playlists} bind:filteredPlaylists />

  <div class="content-view">
      {#if loading}
          <div class="loading-state">Loading playlists...</div>
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
            message="Try a different search or create a new playlist."
            actionLabel="Create One"
            actionClick={() => router.push('/new')}
          />
      {/if}
  </div>
</main>

<style>
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
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
  }

  .loading-state { padding: 4rem; text-align: center; color: var(--text-muted); font-weight: 600; }
</style>
