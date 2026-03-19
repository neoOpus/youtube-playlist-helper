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
      } else {
          // If no ID is provided, we are creating a new one
          playlist = { id: `pl-${Date.now()}`, title: "New Infrastructure Node", videos: [], timestamp: Date.now() };
          videos = [];
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

<div class="editor-view view-container" in:fade>
    {#if loading}
        <div class="loader aura-glow">Quantum Alignment in Progress...</div>
    {:else if playlist}
        <header class="editor-header aura-glow">
            <div class="title-section">
                <input class="pl-title-input" bind:value={playlist.title} placeholder="Untitled Infrastructure..." />
                <span class="pl-meta">{videos.length} nodes currently indexed</span>
            </div>
            <div class="header-actions">
                <button class="action-btn secondary-btn" on:click={() => showBulkAdd = !showBulkAdd}>
                    <PlusMultiple size="18" /> Bulk Link
                </button>
                <button class="action-btn secondary-btn" on:click={handleRemoveDuplicates} title="Deduplicate Nodes">
                    <RemoveDuplicates size="18" /> Deduplicate
                </button>
                <button class="action-btn secondary-btn" on:click={optimizeSequence} title="AI Smart Reorder">
                    <TerminalIcon size="18" /> Optimize
                </button>
                <button class="action-btn primary-btn sota-glow" on:click={save}>
                    <SaveIcon size="18" /> Sync Changes
                </button>
            </div>
        </header>

        {#if showBulkAdd}
            <div class="bulk-add-pane pro-glass" transition:slide>
                <h3 class="card-title mb-4"><PlusMultiple size="18" /> Bulk Node Intake</h3>
                <textarea bind:value={bulkInput} placeholder="Paste YouTube URLs or IDs (one per line)..."></textarea>
                <div class="row justify-end mt-4">
                    <button class="action-btn primary-btn" on:click={addVideos}>Link Nodes</button>
                </div>
            </div>
        {/if}

        <div class="search-bar mt-8 pro-glass">
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
                    class="video-card-wrapper"
                >
                    <PlaylistVideo bind:video on:delete={removeVideo} active={false} />
                </div>
            {/each}
        </div>

        {#if filteredVideos.length > pageSize}
            <div class="pagination-footer mt-12">
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
        <div class="error-state pro-glass">
            <h2>Critical Failure: Node Collection Not Found</h2>
            <p>The requested playlist infrastructure is offline or inaccessible.</p>
        </div>
    {/if}
</div>

<style>
    .view-container {
      padding: var(--space-12) var(--space-8);
      max-width: 1400px;
      margin: 0 auto;
    }

    .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-12);
        padding-bottom: var(--space-8);
        border-bottom: 1px solid var(--border);
    }

    .pl-title-input {
        background: transparent;
        border: none;
        font-size: var(--font-4xl);
        font-weight: 900;
        color: var(--text);
        outline: none;
        letter-spacing: -0.06em;
        width: 100%;
        padding: 0;
        transition: all 0.3s;
    }
    .pl-title-input:focus { color: var(--primary); }

    .pl-meta {
        display: block;
        font-size: var(--font-xs);
        font-weight: 800;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-top: var(--space-2);
        letter-spacing: 0.1em;
        opacity: 0.7;
    }

    .header-actions { display: flex; gap: var(--space-3); }

    .action-btn {
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-lg);
        font-weight: 800;
        cursor: pointer;
        border: 1px solid var(--border);
        transition: all 0.3s var(--easing-standard);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        color: var(--text);
        background: var(--bg-secondary);
        font-size: var(--font-sm);
    }

    .action-btn:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 24px -5px var(--shadow);
        background: var(--hover);
    }

    .primary-btn { background: var(--primary); color: white; border-color: var(--primary); }
    .primary-btn:hover { background: var(--primary-hover); }

    .bulk-add-pane { padding: var(--space-8); margin-bottom: var(--space-8); border: 1px dashed var(--primary); }
    textarea {
        width: 100%;
        height: 160px;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        color: var(--text);
        font-family: 'JetBrains Mono', monospace;
        resize: none;
        outline: none;
        font-size: var(--font-sm);
        transition: border-color 0.3s;
    }
    textarea:focus { border-color: var(--primary); }

    .search-bar {
        padding: var(--space-4) var(--space-6);
        display: flex;
        align-items: center;
        gap: var(--space-4);
        border-radius: var(--radius-xl);
    }
    .search-bar input {
        background: transparent;
        border: none;
        color: var(--text);
        width: 100%;
        outline: none;
        font-weight: 700;
        font-size: var(--font-base);
    }

    .video-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .video-card-wrapper {
        transition: transform 0.3s var(--easing-standard);
    }
    .video-card-wrapper.is-hovering { transform: scale(1.02) translateX(10px); }

    .loader { padding: var(--space-16); text-align: center; font-size: var(--font-xl); font-weight: 900; color: var(--primary); }
    .error-state { text-align: center; padding: var(--space-16); }

    .mt-8 { margin-top: var(--space-8); }
    .mt-12 { margin-top: var(--space-12); }
    .mb-4 { margin-bottom: var(--space-4); }

    @media (max-width: 900px) {
        .editor-header { flex-direction: column; align-items: flex-start; gap: var(--space-6); }
        .header-actions { width: 100%; overflow-x: auto; padding-bottom: var(--space-2); }
    }
</style>
