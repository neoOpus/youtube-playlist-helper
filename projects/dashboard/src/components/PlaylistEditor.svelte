<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, slide, fly } from "svelte/transition";
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
  import SectorDna from "./SectorDna.svelte";
  import SmartRules from "./SmartRules.svelte";
  import BulkOpsOverlay from "./BulkOpsOverlay.svelte";
  import PortfolioExporter from "./PortfolioExporter.svelte";
  import {
    SaveIcon,
    PlusMultiple,
    RemoveDuplicates,
    TerminalIcon,
    SearchIcon,
    SuperButton,
    Breadcrumbs,
    SuperInput,
    DeleteIcon,
    Filter
  } from "@yph/ui-kit";

  let playlist = $state<Playlist | null>(null);
  let videos = $state<Video[]>([]);
  let loading = $state(true);
  let searchQuery = $state("");
  let showBulkAdd = $state(false);
  let showBulkOps = $state(false);
  let bulkInput = $state("");
  let hovering = $state<number | null>(null);
  let titleError = $state("");

  let currentPage = $state(1);
  let pageSize = 20;

  let selectedVideos = $derived(videos.filter(v => v.selected));

  onMount(async () => {
      const id = $router.params?.id;
      if (id && id !== 'new') {
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

      if (!playlist.title.trim()) {
          titleError = "Infrastructure Identifier Required";
          notificationService.error("Validation failed: Title is missing.");
          return;
      }
      titleError = "";

      playlist.loadedVideos = videos;
      playlist.lastModified = Date.now();
      await storageService.savePlaylist(playlist);
      notificationService.success("Infrastructure synchronized.");

      if ($router.path === '/new') {
          router.push(`/edit/${playlist.id}`);
      }
  }

  async function addVideos() {
      const ids = videoService.parseYoutubeIds(bulkInput);
      if (ids.length === 0) {
          notificationService.info("No valid node signatures detected.");
          return;
      }
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

  function applyLogicGrid(updatedVideos: Video[]) {
      const previous = [...videos];
      actionLogger.log("Sync logic grid", async () => {
          videos = previous;
      });
      videos = updatedVideos;
      notificationService.success("Infrastructure filtered via logic engines.");
  }

  function handleBulkApply(action: string, value: any) {
      const previous = [...videos];
      actionLogger.log(`Bulk ${action}`, async () => {
          videos = previous;
      });

      videos = videos.map(v => {
          if (!v.selected) return v;
          if (action === 'tag') return { ...v, aiTags: [...(v.aiTags || []), value] };
          if (action === 'rating') return { ...v, rating: value };
          if (action === 'watched') return { ...v, watched: value };
          return v;
      });

      notificationService.success(`Mass modulation applied to ${selectedVideos.length} nodes.`);
      showBulkOps = false;
  }

  function deleteSelected() {
      if (confirm(`Decommission ${selectedVideos.length} nodes?`)) {
          const previous = [...videos];
          actionLogger.log(`Decommission ${selectedVideos.length} nodes`, async () => {
              videos = previous;
          });
          videos = videos.filter(v => !v.selected);
          notificationService.success("Nodes purged from sector.");
      }
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

  function handleDragOver(e: DragEvent, index: number) {
      e.preventDefault();
      hovering = index;
  }

  function handleDrop(e: DragEvent, targetIndex: number) {
      e.preventDefault();
      hovering = null;
      const draggedId = e.dataTransfer?.getData("text/plain");
      if (!draggedId) return;

      const sourceIndex = videos.findIndex(v => v.videoId === draggedId);
      if (sourceIndex === -1 || sourceIndex === targetIndex) return;

      const updated = [...videos];
      const [draggedItem] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, draggedItem);

      const previous = [...videos];
      actionLogger.log(`Reorder ${draggedItem.title}`, async () => {
          videos = previous;
      });
      videos = updated;
  }
</script>

<div class="editor-view view-container" in:fade>
    {#if loading}
        <div class="loader aura-glow">Pro Alignment in Progress...</div>
    {:else if playlist}
        <header class="editor-header aura-glow">
            <div class="title-section">
                <Breadcrumbs items={[{label: 'INFRASTRUCTURE'}, {label: 'SEQUENCE EDITOR', active: true}]} />
                <div class="title-input-wrapper">
                    <SuperInput
                        bind:value={playlist.title}
                        placeholder="Enter Infrastructure Identifier..."
                        error={titleError}
                        className="hero-input"
                    />
                </div>
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

        <div class="editor-layout">
            <section class="main-sequence">
                {#if showBulkAdd}
                    <div class="bulk-add-pane pro-glass-high" transition:slide>
                        <h3 class="card-title mb-4"><PlusMultiple size="18" /> Bulk Node Intake</h3>
                        <textarea bind:value={bulkInput} placeholder="Paste YouTube URLs or IDs (one per line)..."></textarea>
                        <div class="row justify-end mt-4">
                            <SuperButton onclick={addVideos}>Link Nodes</SuperButton>
                        </div>
                    </div>
                {/if}

                <div class="search-bar pro-glass luminous-hover" onmousemove={handleMouseMove} role="searchbox" tabindex="0">
                    <SearchIcon size="18" color="var(--primary)" />
                    <input type="text" bind:value={searchQuery} placeholder="Filter indexed nodes..." class="ghost-input" />
                </div>

                <div class="video-list mt-8" role="list">
                    {#each paginatedVideos as _, index (paginatedVideos[index].videoId)}
                        {@const globalIndex = index + (currentPage - 1) * pageSize}
                        <div
                            animate:flip={{ duration: 400 }}
                            class:is-hovering={hovering === globalIndex}
                            role="listitem"
                            class="video-card-wrapper"
                            ondragover={(e) => handleDragOver(e, globalIndex)}
                            onmouseleave={() => hovering = null}
                            ondrop={(e) => handleDrop(e, globalIndex)}
                        >
                            <PlaylistVideo bind:video={videos[globalIndex]} ondelete={removeVideo} active={false} />
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
            </section>

            <aside class="editor-sidebar">
                <SectorDna {playlist} />
                <SmartRules bind:videos onapply={applyLogicGrid} />
                <PortfolioExporter {playlist} />
            </aside>
        </div>

        {#if selectedVideos.length > 0}
            <div class="selection-bar pro-glass-high" transition:fly={{ y: 100 }}>
                <div class="sel-meta">
                    <span class="badge primary">{selectedVideos.length}</span>
                    <span class="bold ml-2">Nodes Selected</span>
                </div>
                <div class="sel-actions">
                    <SuperButton outline onclick={() => showBulkOps = true}>
                        <Filter size="16" /> Modulate
                    </SuperButton>
                    <SuperButton danger onclick={deleteSelected}>
                        <DeleteIcon size="16" /> Purge
                    </SuperButton>
                    <SuperButton outline onclick={() => videos.forEach(v => v.selected = false)}>Cancel</SuperButton>
                </div>
            </div>
        {/if}
    {:else}
        <div class="error-state pro-glass">
            <h2>Critical Failure: Node Collection Not Found</h2>
            <p>The requested playlist infrastructure is offline or inaccessible.</p>
        </div>
    {/if}

    <BulkOpsOverlay
        bind:display={showBulkOps}
        {selectedVideos}
        onapply={handleBulkApply}
        onclose={() => showBulkOps = false}
    />
</div>

<style>
    .view-container { padding: var(--space-8); max-width: 1600px; margin: 0 auto; padding-bottom: 120px; }
    .editor-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-12); padding-bottom: var(--space-8); border-bottom: 1px solid var(--border); }
    .title-section { text-align: left; flex-grow: 1; }

    .title-input-wrapper { margin-top: var(--space-2); max-width: 800px; }
    :global(.hero-input .pro-input) {
        font-size: var(--font-4xl) !important;
        font-weight: 900 !important;
        letter-spacing: -0.07em !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
    }
    :global(.hero-input .pro-input:focus) { box-shadow: none !important; }
    :global(.hero-input .focus-ring) { display: none; }

    .pl-meta { display: block; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-top: var(--space-1); letter-spacing: 0.1em; opacity: 0.7; }
    .header-actions { display: flex; gap: var(--space-3); padding-bottom: 8px; }

    .editor-layout { display: grid; grid-template-columns: 1fr 380px; gap: var(--space-12); align-items: start; }

    .bulk-add-pane { padding: var(--space-8); margin-bottom: var(--space-8); border: 1px dashed var(--primary); background: rgba(var(--primary-rgb), 0.02); }
    .card-title { font-weight: 900; display: flex; align-items: center; gap: 8px; }
    textarea { width: 100%; height: 160px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-6); color: var(--text); font-family: 'JetBrains Mono', monospace; resize: none; outline: none; font-size: var(--font-sm); transition: border-color 0.3s; }
    textarea:focus { border-color: var(--primary); }

    .search-bar { padding: var(--space-4) var(--space-6); display: flex; align-items: center; gap: var(--space-4); border-radius: var(--radius-xl); background: var(--bg-secondary); border: 1px solid var(--border); }
    .ghost-input { background: transparent !important; border: none !important; color: var(--text) !important; width: 100%; outline: none !important; font-weight: 800 !important; font-size: var(--font-lg) !important; box-shadow: none !important; padding: 0 !important; }

    .video-list { display: flex; flex-direction: column; gap: var(--space-3); min-height: 200px; }
    .video-card-wrapper { transition: transform 0.3s var(--easing-standard); }
    .video-card-wrapper.is-hovering { transform: translateY(10px); }

    .selection-bar { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 1000; padding: 1rem 2rem; border-radius: 50px; display: flex; align-items: center; gap: 2rem; border: 1px solid var(--border-strong); }
    .sel-meta { display: flex; align-items: center; gap: 8px; }
    .sel-actions { display: flex; gap: 10px; }

    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-16); text-align: center; gap: var(--space-4); background: rgba(var(--primary-rgb), 0.02); border: 1px dashed var(--border); }
    .empty-state h3 { font-size: var(--font-xl); font-weight: 900; }
    .loader { padding: var(--space-16); text-align: center; font-size: var(--font-xl); font-weight: 900; color: var(--primary); }
    .error-state { text-align: center; padding: var(--space-16); }

    .mt-8 { margin-top: var(--space-8); }
    .mb-4 { margin-bottom: var(--space-4); }
    .row { display: flex; }
    .justify-end { justify-content: flex-end; }

    @media (max-width: 1200px) {
        .editor-layout { grid-template-columns: 1fr; }
        .editor-sidebar { order: -1; }
    }
</style>
