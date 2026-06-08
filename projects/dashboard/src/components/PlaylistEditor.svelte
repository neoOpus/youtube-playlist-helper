<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { storageService, videoService, notificationService, playlistService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import { router } from "../stores/router";
  import { ChevronLeft, Save, Plus, Search, LayoutList, CopyCheck } from "lucide-svelte";
  import PlaylistVideo from "./PlaylistVideo.svelte";

  let { params } = $props();
  let playlist = $state<Playlist | null>(null);
  let videos = $state<Video[]>([]);
  let loading = $state(true);

  let searchQuery = $state("");
  let showBulkAdd = $state(false);
  let bulkInput = $state("");

  onMount(async () => {
      const id = params.id;
      if (id) {
          playlist = await storageService.getPlaylist(id);
          if (playlist) {
              const videoPromises = playlist.videos.map(vid => videoService.fetchVideo(vid));
              videos = (await Promise.all(videoPromises)).filter(v => v !== null) as Video[];
          }
      }
      loading = false;
  });

  async function save() {
      if (!playlist) return;
      playlist.videos = videos.map(v => v.videoId);
      playlist.lastModified = Date.now();
      await storageService.savePlaylist(playlist);
      notificationService.success("Playlist saved.");
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

  function cleanDuplicates() {
      const { uniqueVideos, duplicatesCount } = playlistService.removeDuplicates(videos);
      if (duplicatesCount > 0) {
          videos = uniqueVideos;
          notificationService.success(`Removed ${duplicatesCount} duplicates.`);
      } else {
          notificationService.info("No duplicates found.");
      }
  }

  let filteredVideos = $derived(
    searchQuery
      ? videos.filter(v => (v.title || "").toLowerCase().includes(searchQuery.toLowerCase()))
      : videos
  );
</script>

<div class="editor-view">
    {#if loading}
        <div class="loader">Loading playlist...</div>
    {:else if playlist}
        <header class="editor-header">
            <div class="header-left">
                <button class="back-btn" onclick={() => router.push('/')}><ChevronLeft size="18" /></button>
                <div class="title-wrap">
                    <input class="title-input" bind:value={playlist.title} placeholder="Playlist Title" />
                    <span class="meta">{videos.length} Videos</span>
                </div>
            </div>
            <div class="header-actions">
                <button class="outline-btn" onclick={cleanDuplicates} title="Remove Duplicate Videos">
                    <CopyCheck size="16" /> Clean
                </button>
                <button class="outline-btn" onclick={() => showBulkAdd = !showBulkAdd}>
                    <Plus size="16" /> Add
                </button>
                <button class="primary-btn" onclick={save}>
                    <Save size="16" /> Save
                </button>
            </div>
        </header>

        <div class="editor-content">
            {#if showBulkAdd}
                <div class="bulk-pane surface-2" transition:slide>
                    <textarea bind:value={bulkInput} placeholder="Paste YouTube URLs or IDs..."></textarea>
                    <div class="pane-footer">
                        <button class="primary-btn" onclick={addVideos}>Add</button>
                    </div>
                </div>
            {/if}

            <div class="search-bar surface-1">
                <Search size="18" class="icon-muted" />
                <input type="text" bind:value={searchQuery} placeholder="Search in playlist..." />
            </div>

            <div class="video-stack">
                {#each filteredVideos as video (video.videoId)}
                    <div animate:flip={{ duration: 200 }}>
                        <PlaylistVideo {video} ondelete={removeVideo} />
                    </div>
                {/each}

                {#if videos.length === 0}
                    <div class="empty-state surface-1">
                        <LayoutList size="32" class="icon-muted" />
                        <p>This playlist is empty.</p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .editor-view { display: flex; flex-direction: column; gap: 2rem; }
    .editor-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-base); }

    .header-left { display: flex; align-items: center; gap: 1rem; }
    .back-btn { background: var(--bg-surface-2); border: 1px solid var(--border-base); color: var(--text-main); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

    .title-wrap { display: flex; flex-direction: column; }
    .title-input { background: transparent; border: none; font-size: 1.5rem; font-weight: 800; color: var(--text-main); outline: none; }
    .meta { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }

    .header-actions { display: flex; gap: 0.5rem; }
    .primary-btn { background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .outline-btn { background: transparent; border: 1px solid var(--border-strong); color: var(--text-main); padding: 8px 16px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; }

    .bulk-pane { padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 12px; }
    textarea { width: 100%; height: 100px; background: var(--bg-app); border: 1px solid var(--border-base); padding: 1rem; color: var(--text-main); resize: none; border-radius: 8px; margin-bottom: 1rem; }
    .pane-footer { display: flex; justify-content: flex-end; }

    .search-bar { display: flex; align-items: center; padding: 0 1rem; gap: 1rem; margin-bottom: 1.5rem; }
    .search-bar input { flex: 1; background: transparent; border: none; padding: 0.75rem 0; color: var(--text-main); outline: none; font-weight: 500; }

    .video-stack { display: flex; flex-direction: column; border: 1px solid var(--border-base); border-radius: 12px; overflow: hidden; }

    .loader { padding: 4rem; text-align: center; font-weight: 700; color: var(--primary); }
    .empty-state { padding: 4rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    :global(.icon-muted) { color: var(--text-muted); }
</style>
