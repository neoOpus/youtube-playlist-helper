<script>
  import { onMount } from "svelte";
  import PlaylistSelector from "../components/PlaylistSelector.svelte";
  import AdvancedPlaylistView from "../components/AdvancedPlaylistView.svelte";
  import Sidebar from "../components/Sidebar.svelte";

  const playlistsAsync = window.getPlaylists();
  let viewMode = "simple";

  onMount(async () => {
    const settings = await window.getSettings();
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
