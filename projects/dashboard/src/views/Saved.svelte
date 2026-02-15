<script>
  import { onMount } from "svelte";
  import PlaylistSelector from "../components/PlaylistSelector.svelte";
  import AdvancedPlaylistView from "../components/AdvancedPlaylistView.svelte";
  import { storageService } from "@yph/core";

  const playlistsAsync = storageService.getPlaylists();
  let viewMode = "simple";

  onMount(async () => {
    const settings = await storageService.getSettings();
    viewMode = settings.viewMode || "simple";
  });
</script>


<main>
  {#await playlistsAsync then playlists}
    {#if viewMode === "advanced"}
      <AdvancedPlaylistView {playlists} />
    {:else}
      <PlaylistSelector {playlists} />
    {/if}
  {/await}
</main>

<style>
  main {
    padding: 20px;
  }
</style>
