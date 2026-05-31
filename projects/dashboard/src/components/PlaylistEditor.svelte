<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  import {
    storageService,
    videoService,
    actionLogger,
    notificationService,
    playlistService,
    aiService
  } from "@yph/core";
  import type { Playlist, Video, CurriculumStep } from "@yph/core";
  import PlaylistVideo from "./PlaylistVideo.svelte";
  import SimplePagination from "./SimplePagination.svelte";
  import SectorDna from "./SectorDna.svelte";
  import {
    Plus,
    Trash2,
    Dna,
    Zap,
    Save,
    Search,
    ChevronLeft,
    Layers,
    Terminal,
    GraduationCap,
    ArrowRight
  } from "lucide-svelte";
  import { router } from "../stores/router";
  import { appState } from "../stores/theme.svelte";

  let { onsave = () => {}, params = { id: "" } } = $props();

  let playlist = $state<Playlist | null>(null);
  let videos = $state<Video[]>([]);
  let loading = $state(true);
  let bulkInput = $state("");
  let showBulkAdd = $state(false);
  let searchQuery = $state("");

  let currentPage = $state(1);
  let pageSize = 20;

  onMount(async () => {
    if (params.id) {
        const data = await storageService.getPlaylist(params.id);
        if (data) {
            playlist = data;
            const loaded = [];
            for (const vidId of data.videos) {
                loaded.push(await videoService.fetchVideo(vidId));
            }
            videos = loaded.filter(v => v) as Video[];
        }
    } else {
        playlist = { id: "", title: "New Intelligence Node", videos: [], timestamp: Date.now() };
    }
    loading = false;
  });

  async function save() {
      if (!playlist) return;
      playlist.videos = videos.map(v => v.videoId);
      playlist.lastModified = Date.now();

      // Update curriculum steps if enabled
      if (playlist.curriculum?.enabled) {
          playlist.curriculum.steps = videos.map(v => ({
              videoId: v.videoId,
              title: v.title,
              completed: (playlist?.curriculum?.steps.find(s => s.videoId === v.videoId)?.completed) || false
          }));
      }

      const id = await storageService.savePlaylist(playlist);
      playlist.id = id;
      onsave();
      notificationService.success("Infrastructure synchronized.");
  }

  function addVideos() {
      const ids = videoService.parseYoutubeIds(bulkInput);
      const newVideos = ids.map(id => videoService.createVideo(id));
      videos = [...videos, ...newVideos];
      bulkInput = "";
      showBulkAdd = false;
  }

  function removeVideo(video: Video) {
      videos = videos.filter(v => v.videoId !== video.videoId);
  }

  function toggleCurriculum() {
      if (!playlist) return;
      if (!playlist.curriculum) {
          playlist.curriculum = {
              enabled: true,
              currentStepIndex: 0,
              steps: videos.map(v => ({ videoId: v.videoId, title: v.title, completed: false }))
          };
          notificationService.success("Curriculum Protocol initiated.");
      } else {
          playlist.curriculum.enabled = !playlist.curriculum.enabled;
          notificationService.info(playlist.curriculum.enabled ? "Path resumed." : "Path suspended.");
      }
  }

  let filteredVideos = $derived(
    searchQuery
      ? videos.filter(v => (v.title || "").toLowerCase().includes(searchQuery.toLowerCase()))
      : videos
  );

  let paginatedIndices = $derived.by(() => {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return filteredVideos.slice(start, end).map(v => videos.indexOf(v));
  });
</script>

<div class="editor-view">
    {#if loading}
        <div class="loader">Aligning Neural Nodes...</div>
    {:else if playlist}
        <header class="editor-header">
            <div class="header-left">
                <button class="back-btn" onclick={() => router.push('/')}><ChevronLeft size="18" /></button>
                <div class="title-wrap">
                    <input class="title-input" bind:value={playlist.title} />
                    <div class="meta-row">
                        <span class="meta">{videos.length} NODES_INDEXED</span>
                        {#if playlist.curriculum?.enabled}
                            <span class="path-badge">LEARNING_PATH_ACTIVE</span>
                        {/if}
                    </div>
                </div>
            </div>
            <div class="header-actions">
                {#if playlist.curriculum?.enabled}
                    <button class="path-btn" onclick={() => router.push(`/path/${playlist?.id}`)}>
                        <span>ENTER_PATH</span> <ArrowRight size="16" />
                    </button>
                {/if}
                <button class="outline-btn" onclick={() => showBulkAdd = !showBulkAdd}><Plus size="16" /> INTAKE</button>
                <button class="primary-btn" onclick={save}><Save size="16" /> SYNC</button>
            </div>
        </header>

        <div class="editor-grid">
            <div class="main-col">
                {#if showBulkAdd}
                    <div class="bulk-pane surface-2" transition:slide>
                        <textarea bind:value={bulkInput} placeholder="Paste identifiers..."></textarea>
                        <div class="pane-footer">
                            <button class="primary-btn" onclick={addVideos}>PROCESS_INTAKE</button>
                        </div>
                    </div>
                {/if}

                <div class="search-bar surface-1">
                    <Search size="18" class="text-secondary" />
                    <input type="text" bind:value={searchQuery} placeholder="Query nodes..." />
                </div>

                <div class="video-stack">
                    {#each paginatedIndices as idx (videos[idx].videoId)}
                        <div animate:flip={{ duration: 200 }}>
                            <PlaylistVideo bind:video={videos[idx]} ondelete={removeVideo} />
                        </div>
                    {/each}

                    {#if videos.length === 0}
                        <div class="empty-state surface-1">
                            <Terminal size="32" class="text-muted" />
                            <p>No active nodes detected in this sector.</p>
                        </div>
                    {/if}
                </div>

                <SimplePagination totalItems={filteredVideos.length} {pageSize} bind:currentPage />
            </div>

            <aside class="side-col">
                <section class="action-card surface-1">
                    <div class="card-header"><GraduationCap size="16" /> <span>PATH_CONFIGURATION</span></div>
                    <p class="desc">Promote this collection to a sequential Learning Path with progress tracking.</p>
                    <button
                        class="curriculum-toggle mt-4"
                        class:active={playlist.curriculum?.enabled}
                        onclick={toggleCurriculum}
                    >
                        {playlist.curriculum?.enabled ? 'DEACTIVATE_PATH' : 'INITIALIZE_LEARNING_PATH'}
                    </button>
                </section>

                <section class="dna-card surface-1 mt-6">
                    <div class="card-header"><Dna size="16" /> <span>SECTOR_DNA</span></div>
                    <SectorDna playlist={{...playlist, loadedVideos: videos}} />
                </section>

                <section class="help-card surface-1 mt-6">
                    <h3>Optimization Agent</h3>
                    <p>Real-time heuristic analysis is active. Node sequence is being monitored for resonance stability.</p>
                </section>
            </aside>
        </div>
    {/if}
</div>

<style>
    .editor-view { display: flex; flex-direction: column; gap: 32px; }
    .editor-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24px; border-bottom: 1px solid var(--border-base); }

    .header-left { display: flex; align-items: center; gap: 20px; }
    .back-btn { background: var(--bg-surface-1); border: 1px solid var(--border-base); color: var(--text-main); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }

    .title-wrap { display: flex; flex-direction: column; }
    .title-input { background: transparent; border: none; font-size: 1.75rem; font-weight: 800; color: var(--text-main); outline: none; letter-spacing: -0.02em; width: 100%; }

    .meta-row { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
    .meta { font-size: 0.65rem; font-weight: 800; color: var(--text-dim); letter-spacing: 0.1em; }
    .path-badge { font-size: 0.6rem; font-weight: 900; color: var(--secondary); border: 1px solid var(--secondary); padding: 1px 6px; border-radius: 4px; }

    .header-actions { display: flex; gap: 12px; }
    .primary-btn { background: var(--primary); color: white; border: none; padding: 8px 20px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; }
    .primary-btn:hover { background: var(--primary-hover); }
    .outline-btn { background: transparent; border: 1px solid var(--border-strong); color: var(--text-main); padding: 8px 20px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; }

    .path-btn { background: rgba(16, 185, 129, 0.1); color: var(--secondary); border: 1px solid var(--secondary); padding: 8px 16px; border-radius: 6px; font-weight: 900; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .path-btn:hover { background: var(--secondary); color: var(--bg-app); }

    .editor-grid { display: grid; grid-template-columns: 1fr 340px; gap: 32px; }

    .bulk-pane { padding: 16px; margin-bottom: 24px; border: 1px dashed var(--primary); }
    textarea { width: 100%; height: 120px; background: var(--bg-app); border: 1px solid var(--border-base); padding: 12px; color: var(--text-main); font-family: monospace; resize: none; outline: none; border-radius: 6px; }
    .pane-footer { display: flex; justify-content: flex-end; margin-top: 12px; }

    .search-bar { display: flex; align-items: center; padding: 0 16px; gap: 12px; margin-bottom: 24px; }
    .search-bar input { flex: 1; background: transparent; border: none; padding: 12px 0; color: var(--text-main); font-weight: 600; outline: none; }

    .video-stack { display: flex; flex-direction: column; gap: 1px; background: var(--border-subtle); border: 1px solid var(--border-base); border-radius: 8px; overflow: hidden; }

    .side-col { display: flex; flex-direction: column; }
    .action-card, .dna-card, .help-card { padding: 24px; }
    .card-header { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 0.65rem; color: var(--text-dim); margin-bottom: 16px; border-bottom: 1px solid var(--border-base); padding-bottom: 12px; text-transform: uppercase; letter-spacing: 0.1em; }

    .desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; font-weight: 500; }

    .curriculum-toggle {
        width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-strong);
        background: var(--bg-surface-2); color: var(--text-main); font-weight: 700; font-size: 0.75rem;
        cursor: pointer; transition: all 0.2s;
    }
    .curriculum-toggle:hover { border-color: var(--primary); color: var(--primary); }
    .curriculum-toggle.active { background: var(--primary); color: white; border-color: var(--primary); }

    .help-card h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
    .help-card p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; font-weight: 500; }

    .loader { padding: 100px; text-align: center; font-weight: 800; color: var(--primary); }
    .empty-state { padding: 60px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-4 { margin-top: 1rem; }

    @media (max-width: 1100px) { .editor-grid { grid-template-columns: 1fr; } }
</style>
