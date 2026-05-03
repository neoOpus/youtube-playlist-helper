<svelte:options runes={true} />
<script lang="ts">
  import {
    DeleteIcon,
    InfoIcon,
    SearchIcon,
    CheckIcon,
    SuperCheckbox
  } from "@yph/ui-kit";
  import type { Video } from "@yph/core";
  import VideoIdCard from "./VideoIdCard.svelte";
  import { metadataService, alternativesService, predictionEngine, notificationService } from "@yph/core";
  import { ExternalLink, Info, Trash2, Search, Zap, Play } from "lucide-svelte";

  let {
    video = $bindable(),
    ondelete = (v: Video) => {},
    onsave = (v: Video) => {}
  }: {
    video: Video;
    ondelete?: (v: Video) => void;
    onsave?: (v: Video) => void;
  } = $props();

  async function handlePredict() {
      const prediction = await predictionEngine.predictMetadata(video.videoId);
      if (prediction) {
          video = { ...video, ...prediction };
          await handleSave();
          notificationService.success("Metadata recovered.");
      }
  }

  function videoClicked() { window.open(video.url, "_blank"); }
  function deleteVideo() { ondelete(video); }

  let showIdCard = $state(false);
  function openIdCard() { showIdCard = true; }

  function trackDown() {
    const urls = alternativesService.getSearchUrls(video.title, video.videoId);
    window.open(urls[0].url, "_blank");
  }

  async function handleSave() {
    await metadataService.saveVideoMetadata(video.videoId, {
      watched: video.watched,
      notes: video.notes,
      rating: video.rating,
      aiTags: video.aiTags,
      aiSummary: video.aiSummary
    });
    onsave(video);
  }
</script>

<div class="video-row surface-1" class:watched={video.watched} class:selected={video.selected}>
  <div class="selection">
    <SuperCheckbox bind:checked={video.selected} />
  </div>

  <div class="thumbnail" onclick={videoClicked} role="button" tabindex="0" onkeydown={e => e.key === 'Enter' && videoClicked()}>
      <img src={video.thumbnailUrl} alt="" loading="lazy" />
      <div class="thumb-overlay"><Play size="20" fill="currentColor" /></div>
  </div>

  <div class="info" onclick={videoClicked} role="button" tabindex="0" onkeydown={e => e.key === 'Enter' && videoClicked()}>
      <div class="title-row">
          {#if video.title === "Unknown Video"}
              <button class="fix-btn" onclick={e => { e.stopPropagation(); handlePredict(); }}>
                  <Zap size="10" /> RECOVER
              </button>
          {/if}
          <span class="title">{video.title}</span>
      </div>
      <div class="meta-row">
          <span class="channel">{video.channel}</span>
          {#if video.watched}<span class="watched-badge">WATCHED</span>{/if}
      </div>
  </div>

  <div class="actions">
      <button class="action-btn" onclick={trackDown} title="Search"><Search size="14" /></button>
      <button class="action-btn" onclick={openIdCard} title="Details"><Info size="14" /></button>
      <button class="action-btn danger" onclick={deleteVideo} title="Remove"><Trash2 size="14" /></button>
  </div>
</div>

<VideoIdCard bind:display={showIdCard} bind:video on:save={handleSave} />

<style>
  .video-row {
    display: flex; align-items: center; padding: 12px 16px; gap: 16px;
    transition: background-color var(--duration-fast);
  }

  .video-row:hover { background-color: var(--hover); }
  .video-row.selected { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }

  .selection { display: flex; align-items: center; }

  .thumbnail {
      width: 100px; height: 56px; border-radius: 4px; overflow: hidden;
      position: relative; cursor: pointer; flex-shrink: 0; background: var(--bg-app);
  }
  img { width: 100%; height: 100%; object-fit: cover; }
  .thumb-overlay {
      position: absolute; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s;
  }
  .thumbnail:hover .thumb-overlay { opacity: 1; }

  .info { flex: 1; min-width: 0; cursor: pointer; }
  .title-row { display: flex; align-items: center; gap: 8px; }
  .title { font-weight: 600; font-size: 0.95rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .fix-btn {
      background: var(--primary); color: white; border: none; padding: 2px 6px; border-radius: 4px;
      font-size: 0.6rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px;
  }

  .meta-row { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
  .channel { font-size: 0.8rem; color: var(--text-secondary); font-weight: 500; }
  .watched-badge { font-size: 0.6rem; font-weight: 800; color: var(--success); }
  .watched .title { opacity: 0.5; text-decoration: line-through; }

  .actions { display: flex; gap: 8px; }
  .action-btn {
      background: transparent; border: 1px solid var(--border-base); color: var(--text-muted);
      width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s;
  }
  .action-btn:hover { background: var(--border-subtle); color: var(--text-main); border-color: var(--border-strong); }
  .action-btn.danger:hover { color: var(--danger); border-color: var(--danger); }
</style>
