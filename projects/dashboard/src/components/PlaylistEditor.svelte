<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { paginate } from "svelte-paginate";
  import {
    storageService,
    videoService,
    notificationService,
    actionLogger,
    aiService,
    playlistService
  } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import PlaylistVideo from "./PlaylistVideo.svelte";
  import PaginationNav from "./PaginationNav.svelte";
  import {
    SaveIcon,
    PlusMultiple,
    SearchIcon,
    TerminalIcon,
    RemoveDuplicates
  } from "@yph/ui-kit";

  export let params: any = {};
  let playlistId: string;
  let playlist: Playlist;
  let videos: Video[] = [];
  let loading = true;
  let bulkInput = "";
  let showBulkAdd = false;
  let searchQuery = "";

  // Pagination
  let currentPage = 1;
  let pageSize = 20;

  // Drag & Drop
  let hovering: number | null = null;

  $: playlistId = params.id;

  onMount(async () => {
      await loadPlaylist();
  });

  async function loadPlaylist() {
      loading = true;
      const pl = await storageService.getPlaylist(playlistId);
      if (pl) {
          playlist = pl;
          videos = pl.loadedVideos || [];
      }
      loading = false;
  }

  async function save() {
      playlist.loadedVideos = videos;
      playlist.videos = videos.map(v => v.videoId);
      await storageService.savePlaylist(playlist);
      notificationService.success("Infrastructure synchronized.");
  }

  async function addVideos() {
      const ids = videoService.parseYoutubeIds(bulkInput);
      const newVideos = ids.map(id => videoService.createVideo(id));
      videos = [...videos, ...newVideos];
      bulkInput = "";
      showBulkAdd = false;
      notificationService.success(`Linked ${newVideos.length} new nodes.`);
  }

  function removeVideo(e: any) {
      const video = e.detail;
      const previous = [...videos];
      actionLogger.log(`Remove ${video.title}`, async () => {
          videos = previous;
      });
      videos = videos.filter(v => v.videoId !== video.videoId);
  }

  function handleRemoveDuplicates() {
      const result = playlistService.removeDuplicates(videos);
      if (result.duplicatesCount > 0) {
          const previous = [...videos];
          actionLogger.log(`Remove ${result.duplicatesCount} duplicates`, async () => {
              videos = previous;
          });
          videos = result.uniqueVideos;
          notificationService.success(`Purged ${result.duplicatesCount} duplicate nodes.`);
      } else {
          notificationService.info("No duplicates found in this sequence.");
      }
  }

  function optimizeSequence() {
      const previous = [...videos];
      actionLogger.log("Optimize sequence", async () => {
          videos = previous;
      });
      videos = aiService.sequenceOptimizer.optimize(videos);
      notificationService.success("Neural sequence optimized.");
  }

  // Drag and Drop Logic
  const dragstart = (event: any, i: number) => {
    event.dataTransfer.setData("index", i);
    event.dataTransfer.effectAllowed = "move";
  };

  const drop = (event: any, targetIndex: number) => {
    event.preventDefault();
    const sourceIndex = parseInt(event.dataTransfer.getData("index"));

    // Adjust for pagination
    const actualSourceIndex = (currentPage - 1) * pageSize + sourceIndex;
    const actualTargetIndex = (currentPage - 1) * pageSize + targetIndex;

    const previous = [...videos];
    actionLogger.log("Reorder nodes", async () => {
      videos = previous;
    });

    const newVideos = [...videos];
    const [moved] = newVideos.splice(actualSourceIndex, 1);
    newVideos.splice(actualTargetIndex, 0, moved);
    videos = newVideos;
    hovering = null;
  };

  $: filteredVideos = searchQuery
      ? videos.filter(v =>
          (v.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (v.videoId || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      : videos;

  $: paginatedVideos = paginate({ items: filteredVideos, pageSize, currentPage });
</script>

<div class="editor-view" in:fade>
    {#if loading}
        <div class="loader">Quantum Alignment in Progress...</div>
    {:else if playlist}
        <header class="editor-header">
            <div class="title-section">
                <input class="pl-title-input" bind:value={playlist.title} />
                <span class="pl-meta">{videos.length} nodes indexed</span>
            </div>
            <div class="header-actions">
                <button class="btn secondary" on:click={() => showBulkAdd = !showBulkAdd}>
                    <PlusMultiple size="18" /> Bulk Link
                </button>
                <button class="btn secondary" on:click={handleRemoveDuplicates} title="Deduplicate Nodes">
                    <RemoveDuplicates size="18" /> Deduplicate
                </button>
                <button class="btn secondary" on:click={optimizeSequence} title="AI Smart Reorder">
                    <TerminalIcon size="18" /> Optimize
                </button>
                <button class="btn primary-sota sota-glow" on:click={save}>
                    <SaveIcon size="18" /> Sync Changes
                </button>
            </div>
        </header>

        {#if showBulkAdd}
            <div class="bulk-add-pane pro-glass" transition:slide>
                <textarea bind:value={bulkInput} placeholder="Paste YouTube URLs or IDs..."></textarea>
                <div class="row justify-end mt-4">
                    <button class="btn primary" on:click={addVideos}>Link Nodes</button>
                </div>
            </div>
        {/if}

        <div class="search-bar mt-6">
            <SearchIcon size="18" color="var(--text-muted)" />
            <input type="text" bind:value={searchQuery} placeholder="Filter indexed nodes..." />
        </div>

        <div class="video-list mt-8" role="list">
            {#each paginatedVideos as video, index (video.videoId)}
                <div
                    animate:flip={{ duration: 400 }}
                    draggable={true}
                    on:dragstart={(e) => dragstart(e, index)}
                    on:drop={(e) => drop(e, index)}
                    on:dragover|preventDefault={() => hovering = index}
                    on:dragleave={() => hovering = null}
                    class:is-hovering={hovering === index}
                    role="listitem"
                >
                    <PlaylistVideo bind:video on:delete={removeVideo} active={false} />
                </div>
            {/each}
        </div>

        {#if filteredVideos.length > pageSize}
            <div class="pagination-footer mt-8">
                <PaginationNav
                    totalItems={filteredVideos.length}
                    {pageSize}
                    {currentPage}
                    limit={1}
                    showStepOptions={true}
                    on:setPage={(e) => currentPage = e.detail.page}
                />
            </div>
        {/if}
    {:else}
        <div class="error-state">
            <h2>Critical Failure: Node Collection Not Found</h2>
            <p>The requested playlist infrastructure is offline or inaccessible.</p>
        </div>
    {/if}
</div>

<style>
    .editor-view { padding: 2rem; max-width: 1000px; margin: 0 auto; min-height: 100vh; }
    .editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
    .pl-title-input { background: transparent; border: none; font-size: 2rem; font-weight: 900; color: var(--text); outline: none; letter-spacing: -1px; width: 60%; }
    .pl-title-input:focus { border-bottom: 2px solid var(--primary); }
    .pl-meta { display: block; font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }
    .header-actions { display: flex; gap: 0.8rem; }
    .bulk-add-pane { padding: 1.5rem; border-radius: 16px; border: 1px dashed var(--primary); margin-bottom: 2rem; background: var(--card-bg); }
    textarea { width: 100%; height: 120px; background: var(--hover); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; color: var(--text); font-family: 'JetBrains Mono'; resize: none; outline: none; }
    .search-bar { background: var(--hover); border: 1px solid var(--border); border-radius: 12px; padding: 10px 16px; display: flex; align-items: center; gap: 12px; }
    .search-bar input { background: transparent; border: none; color: var(--text); width: 100%; outline: none; font-weight: 700; }
    .btn { padding: 10px 16px; border-radius: 10px; font-weight: 800; cursor: pointer; border: 1px solid var(--border); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--text); font-size: 0.85rem; }
    .btn.primary { background: var(--primary); color: white; border-color: var(--primary); }
    .btn.primary-sota { background: var(--primary); color: white; border-color: var(--primary); }
    .btn.secondary { background: var(--hover); }
    .sota-glow { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3); }
    .loader { padding: 5rem; text-align: center; font-size: 1.2rem; font-weight: 900; color: var(--primary); animation: pulse 2s infinite; }
    .error-state { text-align: center; padding: 5rem; color: var(--text-muted); }
    .error-state h2 { color: var(--danger); font-weight: 900; }
    @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .justify-end { justify-content: flex-end; }
    .row { display: flex; }
    .pagination-footer { display: flex; justify-content: center; border-top: 1px solid var(--border); padding-top: 2rem; }
    .is-hovering { border-top: 4px solid var(--primary); }
</style>
