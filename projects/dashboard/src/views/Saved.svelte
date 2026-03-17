<script>
  import { onMount } from "svelte";
  import PlaylistSelector from "../components/PlaylistSelector.svelte";
  import AdvancedPlaylistView from "../components/AdvancedPlaylistView.svelte";
  import { storageService } from "@yph/core";
  import { viewMode } from "../stores/view-mode";

  const playlistsAsync = storageService.getPlaylists();
</script>


<main>
  {#await playlistsAsync then playlists}
    {#if $viewMode === "advanced"}
      <AdvancedPlaylistView {playlists} />
    {:else}
      <PlaylistSelector {playlists} />
    {/if}
  {/await}
</main>

<style>
  main {
    padding: 20px;
    background-color: var(--background-color);
    min-height: 100vh;
  }
</style>
