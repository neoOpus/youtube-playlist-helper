<script lang="ts">
  import { onMount } from "svelte";
  import type { Playlist, Video } from "../types/model";
  import Sidebar from "../components/core/Sidebar.svelte";
  import PlaylistVideo from "../components/core/PlaylistVideo.svelte";
  import SuperButton from "../components/ui/SuperButton.svelte";
  import SuperInput from "../components/ui/SuperInput.svelte";
  import BulkActionBar from "../components/mega/BulkActionBar.svelte";
  import { paginate } from "svelte-paginate";
  import PaginationNav from "../components/core/PaginationNav.svelte";
  import Fa from "svelte-fa";
  import { faGlobe, faSearch, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

  let allPlaylists: Playlist[] = [];
  let allVideos: (Video & { sourcePlaylistId: string })[] = [];
  let filteredVideos: (Video & { sourcePlaylistId: string })[] = [];
  let loading = true;
  let query = "";

  onMount(async () => {
    allPlaylists = await window.getPlaylists();
    const videoData = await Promise.all(allPlaylists.map(async (p) => {
        const loaded = await Promise.all(p.videos.map(vid => window.videoService.fetchVideo(vid)));
        return loaded.map(v => ({ ...v, sourcePlaylistId: p.id }));
    }));
    allVideos = videoData.flat();
    filteredVideos = allVideos;
    loading = false;
  });

  function handleSearch() {
    filteredVideos = allVideos.filter(v =>
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.channel.toLowerCase().includes(query.toLowerCase())
    );
    currentPage = 1;
  }

  let currentPage = 1;
  let pageSize = 50;
  $: paginatedVideos = paginate({ items: filteredVideos, pageSize, currentPage });

  function clearSelection() {
      allVideos = allVideos.map(v => ({ ...v, selected: false }));
      handleSearch();
  }

  async function bulkMarkWatched(watched: boolean) {
      const selected = allVideos.filter(v => v.selected);
      for (const v of selected) {
          v.watched = watched;
          await window.videoService.saveVideoMetadata(v.videoId, { watched });
      }
      window.success(`Updated ${selected.length} videos across all playlists`);
      handleSearch();
  }
</script>

<Sidebar />

<main>
  <header>
      <h2><Fa icon={faGlobe} /> Omni-Playlist View</h2>
      <p>A unified stream of all your videos across {allPlaylists.length} playlists.</p>
  </header>

  <div class="toolbar">
      <div class="search-wrap">
          <Fa icon={faSearch} />
          <input bind:value={query} on:input={handleSearch} placeholder="Search across all playlists..." />
      </div>
      <div class="stats">
          <Fa icon={faLayerGroup} />
          <span>{filteredVideos.length} Total Videos</span>
      </div>
  </div>

  {#if loading}
    <p>Indexing ecosystem...</p>
  {:else}
    <div class="list" role="list">
        {#each paginatedVideos as video (video.id + video.sourcePlaylistId)}
            <div class="video-row">
                <PlaylistVideo {video} active={false} />
                <div class="source-tag">
                    {allPlaylists.find(p => p.id === video.sourcePlaylistId)?.title || 'Unknown'}
                </div>
            </div>
        {:else}
            <div class="empty">No videos found.</div>
        {/each}
    </div>

    <div class="pagination">
        <PaginationNav totalItems={filteredVideos.length} {pageSize} {currentPage} limit={1} showStepOptions={true} on:setPage={(e) => currentPage = e.detail.page} />
    </div>
  {/if}
</main>

<BulkActionBar
    selectedCount={allVideos.filter(v => v.selected).length}
    on:clearSelection={clearSelection}
    on:markWatched={(e) => bulkMarkWatched(e.detail)}
/>

<style>
  main { padding: 2rem 4rem; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
  header h2 { display: flex; align-items: center; gap: 1rem; margin: 0; }
  header p { color: #888; }

  .toolbar { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 1rem; border-radius: 12px; }
  .search-wrap { display: flex; align-items: center; gap: 10px; background: white; padding: 8px 15px; border-radius: 8px; flex: 0 1 400px; border: 1px solid #eee; }
  .search-wrap input { border: none; outline: none; width: 100%; font-size: 0.95rem; }
  .stats { display: flex; align-items: center; gap: 8px; color: #666; font-weight: bold; }

  .list { border-radius: 16px; border: 1px solid #eee; background: white; overflow: hidden; }
  .video-row { position: relative; border-bottom: 1px solid #f5f5f5; }
  .video-row:last-child { border-bottom: none; }

  .source-tag { position: absolute; top: 10px; right: 200px; font-size: 0.7rem; background: #eee; padding: 2px 8px; border-radius: 4px; color: #888; pointer-events: none; }

  .empty { padding: 4rem; text-align: center; color: #aaa; font-style: italic; }
  .pagination { display: flex; justify-content: center; padding-bottom: 2rem; }
</style>
