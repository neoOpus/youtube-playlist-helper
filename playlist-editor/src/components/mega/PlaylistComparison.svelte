<script lang="ts">
  import { onMount } from "svelte";
  import type { Playlist, Video } from "../../types/model";
  import Sidebar from "../core/Sidebar.svelte";
  import PlaylistVideo from "../core/PlaylistVideo.svelte";
  import SuperButton from "../ui/SuperButton.svelte";
  import SuperSelect from "../ui/SuperSelect.svelte";
  import { actionLogger } from "../../services/mega/action-logger";
  import { playlistService } from "../../services/core/playlist-service";
  import Fa from "svelte-fa";
  import { faExchangeAlt, faSave, faMagic, faTrash } from "@fortawesome/free-solid-svg-icons";

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

  $: playlistOptions = playlists.map(p => ({ value: p.id, label: p.title }));

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
    if (!playlist1 || !playlist2) return;

    const selected = sourceVideos.filter((v) => v.selected);
    if (selected.length === 0) return;

    const previousSource = [...sourceVideos];
    const previousTarget = [...targetVideos];

    actionLogger.log(`Transfer ${selected.length} videos`, () => {
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

  async function smartMerge() {
      if (!playlist1 || !playlist2) return;
      const combined = [...videos1, ...videos2];
      const { uniqueVideos, duplicatesCount } = playlistService.removeDuplicates(combined);
      videos1 = uniqueVideos;
      videos2 = [];
      window.success(`Merged ${duplicatesCount} duplicates. All unique videos moved to Side 1.`);
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
    window.success("Playlists synchronized and saved");
  }
</script>

<Sidebar />

<main class="comparison-container">
  <header>
      <h2><Fa icon={faExchangeAlt} /> Multi-Playlist Orchestrator</h2>
      <p>Synchronize, merge, and organize videos between your collections.</p>
  </header>

  <div class="toolbar">
    <div class="selector-group">
        <SuperSelect options={[{value: '', label: 'Select Playlist 1'}, ...playlistOptions]} bind:value={playlist1Id} on:change={() => loadPlaylist(playlist1Id, 1)} />
    </div>

    <div class="global-actions">
      <SuperButton on:click={smartMerge} variant="secondary" title="Auto-merge duplicates and consolidate">
          <Fa icon={faMagic} /> Smart Merge
      </SuperButton>
      <SuperButton on:click={saveBoth} variant="primary">
          <Fa icon={faSave} /> Commit All Changes
      </SuperButton>
    </div>

    <div class="selector-group">
        <SuperSelect options={[{value: '', label: 'Select Playlist 2'}, ...playlistOptions]} bind:value={playlist2Id} on:change={() => loadPlaylist(playlist2Id, 2)} />
    </div>
  </div>

  <div class="dual-panes">
    <section class="pane" class:active={!!playlist1}>
      {#if playlist1}
        <div class="pane-header">
            <h3>{playlist1.title} <span>{videos1.length} videos</span></h3>
            <SuperButton on:click={() => transferSelected(1)} disabled={!videos1.some(v => v.selected)} variant="ghost">
              Push Selected &rarr;
            </SuperButton>
        </div>
        <div class="scroll-area">
          {#each videos1 as video (video.id)}
            <PlaylistVideo {video} active={false} />
          {/each}
        </div>
      {:else}
        <div class="placeholder">Select a playlist on the left</div>
      {/if}
    </section>

    <div class="divider"><Fa icon={faExchangeAlt} /></div>

    <section class="pane" class:active={!!playlist2}>
      {#if playlist2}
        <div class="pane-header">
            <SuperButton on:click={() => transferSelected(2)} disabled={!videos2.some(v => v.selected)} variant="ghost">
              &larr; Pull Selected
            </SuperButton>
            <h3>{playlist2.title} <span>{videos2.length} videos</span></h3>
        </div>
        <div class="scroll-area">
          {#each videos2 as video (video.id)}
            <PlaylistVideo {video} active={false} />
          {/each}
        </div>
      {:else}
        <div class="placeholder">Select a playlist on the right</div>
      {/if}
    </section>
  </div>
</main>

<style>
  .comparison-container {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  header h2 { display: flex; align-items: center; gap: 1rem; margin: 0; }
  header p { color: #888; margin-top: 0.5rem; }

  .toolbar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 2rem;
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid #eee;
  }

  .global-actions { display: flex; gap: 1rem; }

  .dual-panes {
    display: flex;
    gap: 1rem;
    height: calc(100vh - 250px);
  }

  .pane {
    flex: 1;
    background: white;
    border: 1px solid #eee;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: box-shadow 0.3s;
  }

  .pane.active { box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-color: var(--sidebar-bg-color); }

  .pane-header {
    padding: 1rem;
    background: #fafafa;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pane-header h3 { margin: 0; font-size: 1.1rem; display: flex; flex-direction: column; }
  .pane-header h3 span { font-size: 0.8rem; color: #888; font-weight: normal; }

  .scroll-area {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }

  .divider {
    display: flex;
    align-items: center;
    color: #ccc;
    font-size: 1.5rem;
  }

  .placeholder {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    font-style: italic;
  }
</style>
