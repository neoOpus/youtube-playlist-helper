<svelte:options runes={true} />
<script lang="ts">
  import {
    DeleteIcon,
    InfoIcon,
    SearchIcon,
    CheckIcon,
    SmartElement,
    SuperButton,
    SuperCheckbox,
    TerminalIcon
  } from "@yph/ui-kit";
  import type { Video } from "@yph/core";
  import VideoIdCard from "./VideoIdCard.svelte";
  import { metadataService, alternativesService, predictionEngine, notificationService, globalHeartbeat } from "@yph/core";
  import { spring } from "svelte/motion";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let {
    video = $bindable(),
    active,
    disableThumbnails = false,
    ondelete = (v: Video) => {},
    onsave = (v: Video) => {}
  }: {
    video: Video;
    active: boolean;
    disableThumbnails?: boolean;
    ondelete?: (v: Video) => void;
    onsave?: (v: Video) => void;
  } = $props();

  const cardScale = spring(1, { stiffness: 0.1, damping: 0.3 });
  const cardRotateX = spring(0, { stiffness: 0.1, damping: 0.3 });
  const cardRotateY = spring(0, { stiffness: 0.1, damping: 0.3 });

  let isBeingEnriched = $state(false);

  onMount(() => {
      return globalHeartbeat.subscribe(agents => {
          const enrichmentAgent = agents['enrichment-agent'];
          isBeingEnriched = enrichmentAgent?.activeNodeId === video.id;
      });
  });

  async function handlePredict() {
      const prediction = await predictionEngine.predictMetadata(video.videoId);
      if (prediction) {
          video = { ...video, ...prediction };
          await handleSave();
          notificationService.success("Intelligence recovered metadata.");
      } else {
          notificationService.info("No historical matches found for this node.");
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

  function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") videoClicked();
  }

  function handleMouseMove(e: MouseEvent) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cardRotateY.set(x * 10);
      cardRotateX.set(-y * 10);
      cardScale.set(1.02);
  }

  function handleMouseLeave() {
      cardRotateX.set(0);
      cardRotateY.set(0);
      cardScale.set(1);
  }
</script>

<div
    role="none"
    class="video-motion-wrapper"
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    style="transform: scale({$cardScale}) rotateX({$cardRotateX}deg) rotateY({$cardRotateY}deg); perspective: 1000px;"
>
    <SmartElement
      className="playlist-video-revamp {video.watched ? 'is-watched' : ''} {isBeingEnriched ? 'is-enriching' : ''}"
      {active}
      selected={video.selected}
      ariaLabel="Video node: {video.title}"
    >
      <div class="video-selection" onclick={(e) => e.stopPropagation()} role="presentation">
        <SuperCheckbox bind:checked={video.selected} />
      </div>

      {#if !disableThumbnails}
        <div class="thumbnail-container pro-glass" onclick={(e) => { e.preventDefault(); videoClicked(); }} role="button" tabindex="0" aria-label="Play: {video.title}">
            <img alt="Thumbnail for {video.title}" src={video.thumbnailUrl} loading="lazy" />
            {#if video.watched}
                <div class="watched-overlay"><CheckIcon size="24" color="white" /></div>
            {/if}
            {#if isBeingEnriched}
                <div class="enriching-overlay" in:fade>
                    <TerminalIcon size="24" class="spin" />
                    <span>SCANNING_NODE</span>
                </div>
            {/if}
        </div>
      {/if}

      <div class="video-details" onclick={videoClicked} role="button" tabindex="0" aria-label="View details for {video.title}">
        {#if video.title === "Unknown Video" || !video.title}
            <button class="predict-btn" onclick={(e) => { e.stopPropagation(); handlePredict(); }}>
                <SearchIcon size="12" /> Predict
            </button>
        {/if}
        <div class="title-row">
            {#if video.watched}<span class="badge primary">WATCHED</span>{/if}
            <span class="video-title">{video.title}</span>
        </div>
        <span class="video-channel">{video.channel}</span>

        {#if isBeingEnriched}
            <div class="enriching-bar-wrap mt-2" in:slide>
                <div class="enriching-bar-fill"></div>
            </div>
        {/if}
      </div>

      <div class="video-btns" onclick={(e) => e.stopPropagation()} role="presentation">
        <button onclick={trackDown} title="Track down alternatives" class="video-action-btn"><SearchIcon size="16" /></button>
        <button onclick={openIdCard} title="Video ID Card" class="video-action-btn"><InfoIcon size="16" /></button>
        <button onclick={deleteVideo} title="Delete video" class="video-action-btn danger-btn"><DeleteIcon size="16" /></button>
      </div>
    </SmartElement>
</div>

<VideoIdCard bind:display={showIdCard} bind:video on:save={handleSave} />

<style>
  .video-motion-wrapper { transition: transform 0.1s ease-out; will-change: transform; }
  :global(.playlist-video-revamp) { padding: var(--space-4) var(--space-6); align-items: center; border-radius: var(--radius-lg); background: var(--bg-secondary); border: 1px solid var(--border); transition: all 0.5s var(--easing-standard); position: relative; overflow: hidden; }
  :global(.playlist-video-revamp:hover) { border-color: rgba(var(--primary-rgb), 0.4); box-shadow: 0 15px 30px rgba(0,0,0,0.4); }

  :global(.playlist-video-revamp.is-enriching) { border-color: var(--primary); box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2); }
  :global(.playlist-video-revamp.is-enriching::before) { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(var(--primary-rgb), 0.1), transparent); animation: scan-line 2s infinite linear; }
  @keyframes scan-line { from { left: -100%; } to { left: 200%; } }

  .thumbnail-container { position: relative; width: 140px; height: 78px; margin-right: var(--space-6); border-radius: var(--radius-md); overflow: hidden; cursor: pointer; flex-shrink: 0; }
  img { width: 100%; height: 100%; object-fit: cover; }
  .watched-overlay { position: absolute; inset: 0; background: rgba(var(--bg), 0.6); display: flex; justify-content: center; align-items: center; }

  .enriching-overlay { position: absolute; inset: 0; background: rgba(var(--primary-rgb), 0.4); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: white; }
  .enriching-overlay span { font-size: 8px; font-weight: 900; letter-spacing: 1px; }

  .video-details { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; min-width: 0; cursor: pointer; gap: var(--space-1); }
  .title-row { display: flex; align-items: center; gap: var(--space-3); }
  .video-title { font-weight: 800; font-size: var(--font-base); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--text); }
  .predict-btn { background: linear-gradient(135deg, var(--primary), #d500f9); color: white; border: none; padding: 2px 10px; border-radius: var(--radius-sm); font-size: 10px; font-weight: 800; cursor: pointer; margin-bottom: var(--space-1); display: flex; align-items: center; gap: 4px; width: fit-content; text-transform: uppercase; }
  :global(.playlist-video-revamp.is-watched) .video-title { opacity: 0.5; text-decoration: line-through; }
  .video-channel { font-size: var(--font-xs); font-weight: 700; color: var(--text-muted); opacity: 0.7; }

  .enriching-bar-wrap { height: 2px; background: var(--hover); border-radius: 1px; overflow: hidden; width: 120px; }
  .enriching-bar-fill { height: 100%; background: var(--primary); width: 100%; animation: pulse-bar 1s infinite alternate; }
  @keyframes pulse-bar { from { opacity: 0.3; } to { opacity: 1; } }

  .video-btns { display: flex; justify-content: center; align-items: center; margin-left: var(--space-6); gap: var(--space-3); }
  .video-action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: var(--radius-md); background: var(--hover); border: 1px solid var(--border); color: var(--text-muted); transition: all 0.2s; }
  .video-action-btn:hover { color: white; background: var(--primary); transform: scale(1.1); }
  .danger-btn:hover { background: var(--danger); }
</style>
