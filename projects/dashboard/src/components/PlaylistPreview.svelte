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

{#if playlist}
<SmartElement {active} on:click={handleClick} className="playlist-preview">
  <div class="info">
    <span class="title">{playlist.title || 'Untitled'}</span>
    <PlaylistCount count={playlist.videos?.length || 0} />
  </div>
</SmartElement>
{/if}

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
