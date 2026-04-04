<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { router } from "../stores/router";
  import {
    storageService,
    videoService,
    playlistService,
    aiService,
    actionLogger,
    notificationService
  } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import PlaylistVideo from "./PlaylistVideo.svelte";
  import SimplePagination from "./SimplePagination.svelte";
  import {
    SaveIcon,
    PlusMultiple,
    RemoveDuplicates,
    TerminalIcon,
    SearchIcon,
    SuperButton,
    Breadcrumbs
  } from "@yph/ui-kit";

  let playlist = $state<Playlist | null>(null);
  let videos = $state<Video[]>([]);
  let loading = $state(true);
  let searchQuery = $state("");
  let showBulkAdd = $state(false);
  let bulkInput = $state("");
  let hovering = $state<number | null>(null);

  let currentPage = $state(1);
  let pageSize = 20;

  onMount(async () => {
      const id = $router.params?.id;
      if (id) {
          playlist = await storageService.getPlaylist(id);
          if (playlist) {
              videos = playlist.loadedVideos || [];
          }
      } else {
          playlist = {
              id: crypto.randomUUID(),
              title: "",
              loadedVideos: [],
              videos: [],
              timestamp: Date.now()
          };
          videos = [];
      }
      loading = false;
  });

  async function save() {
      if (!playlist) return;
      playlist.loadedVideos = videos;
      playlist.lastModified = Date.now();
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

  function removeVideo(video: Video) {
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
      notificationService.success("Infrastructure sequence optimized.");
  }

  let filteredVideos = $derived(
    searchQuery
      ? videos.filter(v =>
          (v.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (v.videoId || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      : videos
  );

  let paginatedVideos = $derived(
    filteredVideos.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  );

  function handleMouseMove(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
  }
</script>

<div class="editor-view view-container" in:fade>
    {#if loading}
        <div class="loader aura-glow">Pro Alignment in Progress...</div>
    {:else if playlist}
        <header class="editor-header aura-glow">
            <div class="title-section">
                <Breadcrumbs items={[{label: 'INFRASTRUCTURE'}, {label: 'SEQUENCE EDITOR', active: true}]} />
                <input class="pl-title-input" bind:value={playlist.title} placeholder="Untitled Infrastructure..." />
                <span class="pl-meta">{videos.length} nodes currently indexed</span>
            </div>
            <div class="header-actions">
                <SuperButton outline onclick={() => showBulkAdd = !showBulkAdd}>
                    <PlusMultiple size="18" /> Bulk Link
                </SuperButton>
                <SuperButton outline onclick={handleRemoveDuplicates} title="Deduplicate Nodes">
                    <RemoveDuplicates size="18" /> Deduplicate
                </SuperButton>
                <SuperButton outline onclick={optimizeSequence} title="AI Smart Reorder">
                    <TerminalIcon size="18" /> Optimize
                </SuperButton>
                <SuperButton onclick={save}>
                    <SaveIcon size="18" /> Sync Changes
                </SuperButton>
            </div>
        </header>

        {#if showBulkAdd}
            <div class="bulk-add-pane pro-glass-high" transition:slide>
                <h3 class="card-title mb-4"><PlusMultiple size="18" /> Bulk Node Intake</h3>
                <textarea bind:value={bulkInput} placeholder="Paste YouTube URLs or IDs (one per line)..."></textarea>
                <div class="row justify-end mt-4">
                    <SuperButton onclick={addVideos}>Link Nodes</SuperButton>
                </div>
            </div>
        {/if}

        <div class="search-bar mt-8 pro-glass luminous-hover" onmousemove={handleMouseMove} role="searchbox" tabindex="0">
            <SearchIcon size="18" color="var(--primary)" />
            <input type="text" bind:value={searchQuery} placeholder="Filter indexed nodes..." class="ghost-input" />
        </div>

        <div class="video-list mt-8" role="list">
            {#each paginatedVideos as _, index (paginatedVideos[index].videoId)}
                <div
                    animate:flip={{ duration: 400 }}
                    class:is-hovering={hovering === index}
                    role="listitem"
                    class="video-card-wrapper"
                >
                    <PlaylistVideo bind:video={videos[index + (currentPage - 1) * pageSize]} ondelete={removeVideo} active={false} />
                </div>
            {/each}

            {#if videos.length === 0}
                <div class="empty-state pro-glass" in:fade>
                    <TerminalIcon size="48" color="var(--primary)" />
                    <h3>No Active Nodes</h3>
                    <p class="muted">This infrastructure node is currently empty. Use "Bulk Link" to ingest data.</p>
                </div>
            {/if}
        </div>

        <SimplePagination
            totalItems={filteredVideos.length}
            {pageSize}
            bind:currentPage={currentPage}
            onchange={(p) => currentPage = p}
        />
    {:else}
        <div class="error-state pro-glass">
            <h2>Critical Failure: Node Collection Not Found</h2>
            <p>The requested playlist infrastructure is offline or inaccessible.</p>
        </div>
    {/if}
</div>

<style>
    .view-container { padding: var(--space-8); max-width: 1400px; margin: 0 auto; }
    .editor-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-12); padding-bottom: var(--space-8); border-bottom: 1px solid var(--border); }
    .title-section { text-align: left; flex-grow: 1; }
    .pl-title-input { background: transparent; border: none; font-size: var(--font-4xl); font-weight: 900; color: var(--text); outline: none; letter-spacing: -0.07em; width: 100%; padding: 0; transition: all 0.3s; margin-top: var(--space-2); }
    .pl-title-input:focus { color: var(--primary); }
    .pl-meta { display: block; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-top: var(--space-1); letter-spacing: 0.1em; opacity: 0.7; }
    .header-actions { display: flex; gap: var(--space-3); }
    .bulk-add-pane { padding: var(--space-8); margin-bottom: var(--space-8); border: 1px dashed var(--primary); background: rgba(var(--primary-rgb), 0.02); }
    .card-title { font-weight: 900; display: flex; align-items: center; gap: 8px; }
    textarea { width: 100%; height: 160px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-6); color: var(--text); font-family: 'JetBrains Mono', monospace; resize: none; outline: none; font-size: var(--font-sm); transition: border-color 0.3s; }
    textarea:focus { border-color: var(--primary); }
    .search-bar { padding: var(--space-4) var(--space-6); display: flex; align-items: center; gap: var(--space-4); border-radius: var(--radius-xl); background: var(--bg-secondary); border: 1px solid var(--border); }
    .ghost-input { background: transparent !important; border: none !important; color: var(--text) !important; width: 100%; outline: none !important; font-weight: 800 !important; font-size: var(--font-lg) !important; box-shadow: none !important; padding: 0 !important; }
    .video-list { display: flex; flex-direction: column; gap: var(--space-3); min-height: 200px; }
    .video-card-wrapper { transition: transform 0.3s var(--easing-standard); }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-16); text-align: center; gap: var(--space-4); background: rgba(var(--primary-rgb), 0.02); border: 1px dashed var(--border); }
    .empty-state h3 { font-size: var(--font-xl); font-weight: 900; }
    .loader { padding: var(--space-16); text-align: center; font-size: var(--font-xl); font-weight: 900; color: var(--primary); }
    .error-state { text-align: center; padding: var(--space-16); }
    .mt-8 { margin-top: var(--space-8); }
    .mb-4 { margin-bottom: var(--space-4); }
    .row { display: flex; }
    .justify-end { justify-content: flex-end; }
</style>
