<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import {
    CloseIcon,
    SearchIcon,
    InfoIcon,
    PlaylistPlayIcon,
    PlusMultiple,
    SaveIcon
  } from "@yph/ui-kit";
  import { storageService, videoService, notificationService, alternativesService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";

  const dispatch = createEventDispatcher();
  export let display = false;

  let scanning = false;
  let brokenVideos: { video: Video, playlist: Playlist }[] = [];
  let currentVideoIndex = -1;
  let alternatives = [];

  async function scanLibrary() {
      scanning = true;
      brokenVideos = [];
      const playlists = await storageService.getPlaylists();

      for (const pl of playlists) {
          const vids = await Promise.all((pl.videos || []).map(id => videoService.fetchVideo(id)));
          for (const v of vids) {
              if (v.title === "Unknown Video" || !v.title) {
                  brokenVideos.push({ video: v, playlist: pl });
              }
          }
      }

      if (brokenVideos.length > 0) currentVideoIndex = 0;
      else notificationService.success("No broken videos found in your library.");
      scanning = false;
  }

  $: {
      if (currentVideoIndex >= 0 && brokenVideos[currentVideoIndex]) {
          alternatives = alternativesService.getSearchUrls(brokenVideos[currentVideoIndex].video.title, brokenVideos[currentVideoIndex].video.videoId);
      } else {
          alternatives = [];
      }
  }

  function next() {
      if (currentVideoIndex < brokenVideos.length - 1) currentVideoIndex++;
      else {
          notificationService.info("End of broken video list.");
          close();
      }
  }

  function close() {
      display = false;
      currentVideoIndex = -1;
      brokenVideos = [];
  }

  async function replaceVideo() {
      const newUrl = prompt("Enter the replacement YouTube URL:");
      if (!newUrl) return;
      const newId = videoService.parseYoutubeId(newUrl);
      if (newId) {
          const { video, playlist } = brokenVideos[currentVideoIndex];
          const newVideos = playlist.videos.map(id => id === video.videoId ? newId : id);
          await storageService.savePlaylist({ ...playlist, videos: newVideos });
          notificationService.success("Video replaced successfully.");
          next();
      } else {
          notificationService.error("Invalid YouTube URL.");
      }
  }
</script>

{#if display}
<div class="repair-overlay" transition:fade>
    <div class="repair-container pro-glass" in:fly={{ y: 50 }}>
        <div class="repair-header">
            <h3><SearchIcon size="20" /> Smart Repair Hub</h3>
            <button class="close-btn" on:click={close}><CloseIcon size="20" /></button>
        </div>

        <div class="repair-content">
            {#if scanning}
                <div class="loading-pane" in:fade>
                    <div class="spinner"></div>
                    <p>Scanning entire library for dead links...</p>
                </div>
            {:else if brokenVideos.length === 0}
                <div class="empty-pane" in:fade>
                    <InfoIcon size="48" color="var(--primary)" />
                    <h3>Library is Healthy</h3>
                    <p>Click below to start a deep scan for unavailable videos.</p>
                    <button class="btn primary pro-glow mt-4" on:click={scanLibrary}>Run Deep Scan</button>
                </div>
            {:else}
                <div class="repair-pane" in:fade>
                    <div class="status-bar">
                        <span>Video {currentVideoIndex + 1} of {brokenVideos.length}</span>
                        <div class="progress"><div class="fill" style="width: {((currentVideoIndex + 1) / brokenVideos.length) * 100}%"></div></div>
                    </div>

                    <div class="video-info-card mt-4">
                        <span class="label">PLAYLIST: {brokenVideos[currentVideoIndex].playlist.title}</span>
                        <h4 class="mt-2">{brokenVideos[currentVideoIndex].video.title}</h4>
                        <code class="mt-2">{brokenVideos[currentVideoIndex].video.videoId}</code>
                    </div>

                    <div class="alternatives-section mt-6">
                        <p class="section-label">SEARCH FOR ALTERNATIVES</p>
                        <div class="alt-grid">
                            {#each alternatives as alt}
                                <a href={alt.url} target="_blank" class="alt-link">
                                    <PlusMultiple size="16" />
                                    <span>{alt.name}</span>
                                </a>
                            {/each}
                        </div>
                    </div>

                    <div class="actions mt-8">
                        <button class="btn secondary" on:click={next}>Skip</button>
                        <button class="btn primary-pro" on:click={replaceVideo}>Replace Video</button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
{/if}

<style>
    .repair-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
    }

    .repair-container {
        width: 550px;
        max-width: 90vw;
        display: flex;
        flex-direction: column;
    }

    .pro-glass {
        background: var(--card-bg-alpha, rgba(20, 25, 35, 0.85));
        backdrop-filter: blur(24px);
        border: 1px solid var(--border);
        border-radius: 24px;
        box-shadow: 0 32px 128px rgba(0, 0, 0, 0.6);
    }

    .repair-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .repair-header h3 { margin: 0; display: flex; align-items: center; gap: 10px; font-weight: 900; letter-spacing: -1px; }

    .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }

    .repair-content {
        padding: 2rem;
        min-height: 400px;
    }

    .loading-pane, .empty-pane {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: 3rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--hover);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .status-bar { display: flex; align-items: center; gap: 15px; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); }
    .progress { height: 6px; background: var(--hover); flex-grow: 1; border-radius: 3px; overflow: hidden; }
    .fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary); transition: width 0.3s; }

    .video-info-card {
        background: var(--hover);
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid var(--border);
    }
    .video-info-card .label { font-size: 0.6rem; font-weight: 800; color: var(--primary); letter-spacing: 1.5px; }
    .video-info-card h4 { font-size: 1.2rem; font-weight: 900; margin: 0; }
    .video-info-card code { font-size: 0.8rem; background: rgba(0, 0, 0, 0.3); padding: 4px 8px; border-radius: 4px; color: #ff8a80; }

    .alt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    .alt-link {
        background: var(--card-bg);
        border: 1px solid var(--border);
        padding: 12px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: var(--text);
        font-weight: 700;
        font-size: 0.85rem;
        transition: all 0.2s;
    }
    .alt-link:hover { border-color: var(--primary); background: var(--hover); transform: translateY(-2px); }

    .section-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1.5px; }

    .actions { display: flex; gap: 15px; }
    .btn { padding: 14px 24px; border-radius: 14px; font-weight: 800; cursor: pointer; border: 1px solid var(--border); transition: all 0.2s; flex-grow: 1; }
    .btn.primary-pro { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 15px rgba(255, 82, 82, 0.3); }
    .btn.secondary { background: var(--hover); color: var(--text); }

    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .pro-glow { box-shadow: 0 0 20px rgba(255, 82, 82, 0.4); }
</style>
