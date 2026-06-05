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
  import { Info, Trash2, Search, Zap, Play, Clock, Sparkles, Copy } from "lucide-svelte";
  import { fade } from "svelte/transition";

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

  function copyId() {
      navigator.clipboard.writeText(video.videoId);
      notificationService.success("Identifier copied.");
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
      <div class="duration-overlay">{video.duration || '0:00'}</div>
      <div class="thumb-overlay"><Play size={20} fill="currentColor" /></div>
  </div>

  <div class="info" onclick={videoClicked} role="button" tabindex="0" onkeydown={e => e.key === 'Enter' && videoClicked()}>
      <div class="title-row">
          {#if video.title === "Unknown Video"}
              <button class="fix-btn" onclick={e => { e.stopPropagation(); handlePredict(); }}>
                  <Zap size={10} /> RECOVER
              </button>
          {/if}
          <span class="title">{video.title}</span>
      </div>
      <div class="meta-row">
          <span class="channel">{video.channel}</span>
          {#if video.energyVibe}
            <span class="vibe-tag">
                <Sparkles size={10} /> {video.energyVibe.toUpperCase()}
            </span>
          {/if}
          {#if video.watched}<span class="watched-badge">WATCHED</span>{/if}
      </div>
  </div>

  <div class="actions" onclick={e => e.stopPropagation()} role="presentation">
      <button class="id-copy" onclick={copyId} title="Copy Identifier">
          <Copy size={12} />
          <span>{video.videoId}</span>
      </button>
      <div class="divider"></div>
      <button class="action-btn" onclick={trackDown} title="Search"><Search size={14} /></button>
      <button class="action-btn" onclick={openIdCard} title="Details"><Info size={14} /></button>
      <button class="action-btn danger" onclick={deleteVideo} title="Remove"><Trash2 size={14} /></button>
  </div>
</div>

<VideoIdCard bind:display={showIdCard} bind:video on:save={handleSave} />

<style>
  .video-row {
    display: flex; align-items: center; padding: 12px 20px; gap: 20px;
    transition: all var(--duration-fast);
    border-radius: 0; border: none; border-bottom: 1px solid var(--border-subtle);
    background: transparent;
  }

  .video-row:hover { background-color: var(--surface-hover); }
  .video-row.selected { background: rgba(var(--primary-rgb), 0.05); }

  .selection { display: flex; align-items: center; }

  .thumbnail {
      width: 120px; height: 68px; border-radius: 6px; overflow: hidden;
      position: relative; cursor: pointer; flex-shrink: 0; background: var(--bg-app);
      border: 1px solid var(--border-base);
  }
  img { width: 100%; height: 100%; object-fit: cover; }

  .duration-overlay {
      position: absolute; bottom: 4px; right: 4px;
      background: rgba(0,0,0,0.8); color: white; padding: 2px 6px;
      border-radius: 4px; font-size: 0.65rem; font-weight: 800; font-family: monospace;
      z-index: 2;
  }

  .thumb-overlay {
      position: absolute; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s;
      z-index: 1;
  }
  .thumbnail:hover .thumb-overlay { opacity: 1; }

  .info { flex: 1; min-width: 0; cursor: pointer; }
  .title-row { display: flex; align-items: center; gap: 8px; }
  .title { font-weight: 600; font-size: 0.95rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .fix-btn {
      background: var(--primary); color: white; border: none; padding: 2px 6px; border-radius: 4px;
      font-size: 0.6rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px;
      flex-shrink: 0;
  }

  .meta-row { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
  .channel { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }

  .vibe-tag {
      display: flex; align-items: center; gap: 4px; font-size: 0.6rem; font-weight: 900;
      color: var(--secondary); background: rgba(var(--secondary-rgb), 0.1);
      padding: 2px 8px; border-radius: 4px; letter-spacing: 0.05em;
  }

  .watched-badge { font-size: 0.6rem; font-weight: 900; color: var(--success); letter-spacing: 0.05em; }
  .watched .title { opacity: 0.4; text-decoration: line-through; }

  .actions { display: flex; align-items: center; gap: 8px; }

  .id-copy {
      background: var(--bg-surface-2); border: 1px solid var(--border-base);
      color: var(--text-muted); padding: 4px 10px; border-radius: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; font-weight: 700;
      cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
  }
  .id-copy:hover { border-color: var(--primary); color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }

  .divider { width: 1px; height: 16px; background: var(--border-base); margin: 0 4px; }

  .action-btn {
      background: transparent; border: 1px solid var(--border-base); color: var(--text-muted);
      width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s;
  }
  .action-btn:hover { background: var(--bg-surface-3); color: var(--text-main); border-color: var(--border-strong); transform: translateY(-2px); }
  .action-btn.danger:hover { color: var(--danger); border-color: var(--danger); background: rgba(239, 68, 68, 0.1); }

  @media (max-width: 800px) {
      .id-copy span { display: none; }
      .thumbnail { width: 100px; height: 56px; }
  }
</style>
