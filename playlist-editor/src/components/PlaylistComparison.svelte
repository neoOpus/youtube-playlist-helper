<script lang="ts">
  import { onMount } from "svelte";
  import type { Playlist, Video } from "../types/model";
  import Sidebar from "./Sidebar.svelte";
  import PlaylistVideo from "./PlaylistVideo.svelte";
  import SuperButton from "./SuperButton.svelte";
  import SearchIcon from "./icons/SearchIcon.svelte";
  import CloseIcon from "./icons/CloseIcon.svelte";
  import { actionLogger } from "../services/action-logger";

  let playlists: Playlist[] = [];
  let playlist1Id = "";
  let playlist2Id = "";
  let playlist1: Playlist | null = null;
  let playlist2: Playlist | null = null;
  let videos1: Video[] = [];
  let videos2: Video[] = [];

  onMount(async () => {
    playlists = await window.getPlaylists();
  });

  async function loadPlaylist(id: string, side: 1 | 2) {
    if (!id) return;
    const p = await window.getPlaylist(id);
    const loadedVideos = await Promise.all(
      p.videos.map((vid) => window.videoService.fetchVideo(vid))
    );
    if (side === 1) {
      playlist1 = p;
      videos1 = loadedVideos;
    } else {
      playlist2 = p;
      videos2 = loadedVideos;
    }
  }

  async function transferSelected(from: 1 | 2) {
    const sourceVideos = from === 1 ? videos1 : videos2;
    const targetVideos = from === 1 ? videos2 : videos1;
    const sourcePlaylist = from === 1 ? playlist1 : playlist2;
    const targetPlaylist = from === 1 ? playlist2 : playlist1;

    if (!sourcePlaylist || !targetPlaylist) return;

    const selected = sourceVideos.filter((v) => v.selected);
    if (selected.length === 0) return;

    const previousSource = [...sourceVideos];
    const previousTarget = [...targetVideos];

    actionLogger.log(`Transfer ${selected.length} videos`, async () => {
      if (from === 1) {
        videos1 = previousSource;
        videos2 = previousTarget;
      } else {
        videos2 = previousSource;
        videos1 = previousTarget;
      }
    });

    const newTargetVideos = [...targetVideos, ...selected.map(v => ({...v, selected: false}))];
    const newSourceVideos = sourceVideos.filter((v) => !v.selected);

    if (from === 1) {
      videos1 = newSourceVideos;
      videos2 = newTargetVideos;
    } else {
      videos2 = newSourceVideos;
      videos1 = newTargetVideos;
    }
  }

  async function saveBoth() {
    if (playlist1) {
      playlist1.videos = videos1.map(v => v.videoId);
      await window.savePlaylist(playlist1);
    }
    if (playlist2) {
      playlist2.videos = videos2.map(v => v.videoId);
      await window.savePlaylist(playlist2);
    }
    window.success("Playlists saved");
  }
</script>

<Sidebar />

<main class="comparison-container">
  <h2>Playlist Comparison & Merge</h2>

  <div class="selectors">
    <select bind:value={playlist1Id} on:change={() => loadPlaylist(playlist1Id, 1)}>
      <option value="">Select Playlist 1</option>
      {#each playlists as p}
        <option value={p.id}>{p.title}</option>
      {/each}
    </select>

    <div class="actions">
      <SuperButton on:click={saveBoth} bgcolor="#28a745">Save All Changes</SuperButton>
    </div>

    <select bind:value={playlist2Id} on:change={() => loadPlaylist(playlist2Id, 2)}>
      <option value="">Select Playlist 2</option>
      {#each playlists as p}
        <option value={p.id}>{p.title}</option>
      {/each}
    </select>
  </div>

  <div class="dual-view">
    <div class="pane">
      {#if playlist1}
        <div class="pane-header">
            <h3>{playlist1.title} ({videos1.length})</h3>
            <SuperButton on:click={() => transferSelected(1)} disabled={!videos1.some(v => v.selected)}>Transfer Selected &rarr;</SuperButton>
        </div>
        <div class="list">
          {#each videos1 as video (video.id)}
            <PlaylistVideo {video} active={false} on:save={() => loadPlaylist(playlist1Id, 1)} />
          {/each}
        </div>
      {:else}
        <p>Select a playlist to compare</p>
      {/if}
    </div>

    <div class="pane">
      {#if playlist2}
        <div class="pane-header">
            <h3>{playlist2.title} ({videos2.length})</h3>
            <SuperButton on:click={() => transferSelected(2)} disabled={!videos2.some(v => v.selected)}>&larr; Transfer Selected</SuperButton>
        </div>
        <div class="list">
          {#each videos2 as video (video.id)}
            <PlaylistVideo {video} active={false} on:save={() => loadPlaylist(playlist2Id, 2)} />
          {/each}
        </div>
      {:else}
        <p>Select a playlist to compare</p>
      {/if}
    </div>
  </div>
</main>

<style>
  .comparison-container {
    max-width: 1200px;
    margin-left: 15rem;
  }

  .selectors {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    gap: 20px;
  }

  .selectors select {
    flex: 1;
    padding: 10px;
  }

  .dual-view {
    display: flex;
    gap: 20px;
    width: 100%;
    height: calc(100vh - 200px);
  }

  .pane {
    flex: 1;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: rgba(0, 0, 0, 0.02);
  }

  .pane-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
