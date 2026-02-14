<script lang="ts">
  import PlaylistCount from "./PlaylistCount.svelte";
  import { SmartElement } from "@yph/ui-kit";
  import type { Playlist } from "@yph/core";
  import { createEventDispatcher } from "svelte";

  export let playlist: Playlist;
  export let active = false;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("click", playlist);
  }
</script>

<SmartElement {active} on:click={handleClick} className="playlist-preview">
  <div class="info">
    <span class="title">{playlist.title}</span>
    <PlaylistCount count={playlist.videos.length} />
  </div>
</SmartElement>

<style>
  :global(.playlist-preview) {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  .info {
    display: flex;
    flex-direction: column;
  }
  .title {
    font-weight: bold;
  }
</style>
