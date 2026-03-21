<script lang="ts">
  import type { Playlist } from "@yph/core";
  import PlaylistsFilters from "./PlaylistsFilters.svelte";
  import PlaylistPreview from "./PlaylistPreview.svelte";

  let {
    playlists = $bindable([]),
    filteredPlaylists = $bindable([])
  }: {
    playlists?: Playlist[];
    filteredPlaylists: Playlist[];
  } = $props();

  function handleDeleted(pl: Playlist) {
    playlists = playlists.filter(p => p.id !== pl.id);
  }
</script>

{#if playlists.length > 0}
  <PlaylistsFilters bind:playlists bind:filteredPlaylists />
{/if}

<div class="playlists-list mt-6">
  {#each filteredPlaylists as pl (pl.id)}
    <PlaylistPreview playlist={pl} ondeleted={handleDeleted} />
  {/each}
</div>

<style>
  .playlists-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
</style>
