<script lang="ts">
  import { storage } from '../services/core/storage-service';
  import { onMount } from "svelte";
  import type { Playlist, Video } from "../types/model";
  import Sidebar from "../components/core/Sidebar.svelte";
  import PlaylistVideo from "../components/core/PlaylistVideo.svelte";
import { metadataService } from "../services/mega/metadata-service";
  import BulkActionBar from "../components/mega/BulkActionBar.svelte";
  import VirtualList from "svelte-virtual-list";
  import Fa from "svelte-fa";
  import { faGlobe, faSearch, faLayerGroup, faSync } from "@fortawesome/free-solid-svg-icons";

  let allPlaylists: Playlist[] = [];
  let allVideos: (Video & { sourcePlaylistId: string })[] = [];
  let filteredVideos: (Video & { sourcePlaylistId: string })[] = [];
  let loading = true;
  let indexingProgress = 0;
  let query = "";

  onMount(async () => {
    await indexEcosystem();
  });

  async function indexEcosystem() {
    loading = true;
    allPlaylists = await storage.getPlaylists();
    const videoData = [];

    for (let i = 0; i < allPlaylists.length; i++) {
        const p = allPlaylists[i];
        indexingProgress = Math.round(((i + 1) / allPlaylists.length) * 100);

        // Chunked loading to prevent UI freeze
        const loaded = await Promise.all(p.videos.map(vid => window.videoService.fetchVideo(vid)));
        videoData.push(...loaded.map(v => ({ ...v, sourcePlaylistId: p.id })));

        // Yield to browser
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
    }

    allVideos = videoData;
    filteredVideos = allVideos;
    loading = false;
  }

  function handleSearch() {
    const q = query.toLowerCase();
    filteredVideos = allVideos.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q)
    );
  }

  function clearSelection() {
      allVideos = allVideos.map(v => ({ ...v, selected: false }));
      handleSearch();
  }

  async function bulkMarkWatched(watched: boolean) {
      const selected = allVideos.filter(v => v.selected);
      for (const v of selected) {
          v.watched = watched;
          await metadataService.saveVideoMetadata(v.videoId, { watched });
      }
      window.success(`Updated ${selected.length} videos across all playlists`);
      handleSearch();
  }
</script>

<Sidebar />

<main>
  <header>
      <div class="title-row">
          <h2><Fa icon={faGlobe} /> Omni-Playlist View</h2>
          {#if loading}
            <div class="progress-pill">
                <Fa icon={faSync} spin />
                <span>Indexing Library: {indexingProgress}%</span>
            </div>
          {/if}
      </div>
      <p>A high-performance unified stream of your entire digital library.</p>
  </header>

  <div class="toolbar">
      <div class="search-wrap">
          <Fa icon={faSearch} />
          <input bind:value={query} on:input={handleSearch} placeholder="Search {allVideos.length} videos instantly..." />
      </div>
      <div class="stats">
          <Fa icon={faLayerGroup} />
          <span>{filteredVideos.length} Results</span>
      </div>
  </div>

  <div class="list-container">
    {#if loading && allVideos.length === 0}
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Scanning ecosystem nodes...</p>
        </div>
    {:else}
        <div class="virtual-list-wrapper">
            <VirtualList items={filteredVideos} let:item>
                <div class="video-row">
                    <PlaylistVideo video={item} active={false} />
                    <div class="source-tag">
                        {allPlaylists.find(p => p.id === item.sourcePlaylistId)?.title || 'Unknown'}
                    </div>
                </div>
            </VirtualList>
            {#if filteredVideos.length === 0}
                <div class="empty">No matching videos found in ecosystem.</div>
            {/if}
        </div>
    {/if}
  </div>
</main>

<BulkActionBar
    selectedCount={allVideos.filter(v => v.selected).length}
    on:clearSelection={clearSelection}
    on:markWatched={(e) => bulkMarkWatched(e.detail)}
/>

<style>
  main { padding: 2rem 4rem; max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; height: 100vh; }
  header h2 { display: flex; align-items: center; gap: 1rem; margin: 0; }
  header p { color: #888; }

  .title-row { display: flex; align-items: center; justify-content: space-between; }
  .progress-pill { background: #e0f2f1; color: #00695c; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; display: flex; align-items: center; gap: 8px; font-weight: bold; }

  .toolbar { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 1rem; border-radius: 12px; }
  .search-wrap { display: flex; align-items: center; gap: 12px; background: white; padding: 10px 15px; border-radius: 10px; flex: 0 1 500px; border: 1px solid #eee; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
  .search-wrap input { border: none; outline: none; width: 100%; font-size: 1rem; }
  .stats { display: flex; align-items: center; gap: 8px; color: #666; font-weight: bold; }

  .list-container { flex: 1; min-height: 0; background: white; border-radius: 16px; border: 1px solid #eee; overflow: hidden; position: relative; }

  .virtual-list-wrapper { height: 100%; }

  .video-row { position: relative; border-bottom: 1px solid #f5f5f5; }
  .source-tag { position: absolute; top: 12px; right: 220px; font-size: 0.65rem; background: #f0f0f0; padding: 2px 8px; border-radius: 4px; color: #999; pointer-events: none; text-transform: uppercase; letter-spacing: 0.5px; z-index: 10; }

  .loading-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: #aaa; }
  .spinner { width: 30px; height: 30px; border: 3px solid #eee; border-top-color: var(--sidebar-bg-color); border-radius: 50%; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .empty { padding: 4rem; text-align: center; color: #aaa; font-style: italic; }
</style>
