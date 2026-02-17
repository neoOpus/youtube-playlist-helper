<script>
  import { onMount } from "svelte";
  import PlaylistSelector from "../components/core/PlaylistSelector.svelte";
  import AdvancedPlaylistView from "../components/mega/AdvancedPlaylistView.svelte";
  import Sidebar from "../components/core/Sidebar.svelte";

  const playlistsAsync = storage.getPlaylists();
  let viewMode = "simple";

  onMount(async () => {
    const settings = await storage.getSettings();
    viewMode = settings.viewMode || "simple";
  });
</script>

<Sidebar />

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
</style>
