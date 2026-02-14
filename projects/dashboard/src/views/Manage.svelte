<script>
  import { storageService } from "@yph/core";

  async function clearAll() {
    if (confirm("Are you sure you want to delete all saved playlists?")) {
        // storageService.removeSavedPlaylists()
    }
  }
</script>

<main>
  <h1>Manage Playlists</h1>
  <button on:click={clearAll}>Clear All Saved Playlists</button>
</main>

<style>
  main {
    margin-left: 240px;
    padding: 20px;
  }
</style>
