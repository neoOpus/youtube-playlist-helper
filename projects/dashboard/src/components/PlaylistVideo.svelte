<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    DeleteIcon,
    InfoIcon,
    SearchIcon,
    CheckIcon,
    SmartElement,
    SuperButton,
    SuperCheckbox
  } from "@yph/ui-kit";
  import type { Video } from "@yph/core";
  import VideoIdCard from "./VideoIdCard.svelte";
  import { metadataService, alternativesService } from "@yph/core";

  export let video: Video;
  export let active: boolean;
  export let disableThumbnails = false;

  const dispatch = createEventDispatcher();

  import { predictionEngine, notificationService } from "@yph/core";
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

  function videoClicked() {
    window.open(video.url, "_blank");
  }

  function deleteVideo() {
    dispatch("delete", video);
  }

  let showIdCard = false;
  function openIdCard() {
    showIdCard = true;
  }

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
    dispatch("save", video);
  }

  function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
          videoClicked();
      }
  }
</script>

<SmartElement
  className="playlist-video-revamp {video.watched ? 'is-watched' : ''}"
  {active}
  selected={video.selected}
  ariaLabel="Video node: {video.title}"
>
  <div
    class="video-selection"
    on:click|stopPropagation
    on:keydown|stopPropagation
    role="presentation"
  >
    <SuperCheckbox bind:checked={video.selected} />
  </div>

  {#if !disableThumbnails}
    <div
        class="thumbnail-container pro-glass"
        on:click|preventDefault={videoClicked}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
        aria-label="Play: {video.title}"
    >
        <img
          alt="Thumbnail for {video.title}"
          src={video.thumbnailUrl}
          loading="lazy"
        />
        {#if video.watched}
            <div class="watched-overlay">
                <CheckIcon size="24" color="white" />
            </div>
        {/if}
    </div>
  {/if}

  <div class="video-details" on:click={videoClicked} on:keydown={handleKeydown} role="button" tabindex="0" aria-label="View details for {video.title}">
        {#if video.title === "Unknown Video" || !video.title}
            <button class="predict-btn" on:click|stopPropagation={handlePredict} title="Predict Metadata via AI" aria-label="Predict metadata">
                <SearchIcon size="12" /> Predict
            </button>
        {/if}
    <div class="title-row">
        {#if video.watched}
            <span class="badge primary">WATCHED</span>
        {/if}
        <span class="video-title">{video.title}</span>
    </div>
    <span class="video-channel">{video.channel}</span>
  </div>

  <div class="video-btns" on:click|stopPropagation on:keydown|stopPropagation role="presentation">
    <button on:click={trackDown} title="Track down alternatives" class="video-action-btn" aria-label="Search alternatives">
        <SearchIcon size="16" />
    </button>
    <button on:click={openIdCard} title="Video ID Card" class="video-action-btn" aria-label="Open ID Card">
        <InfoIcon size="16" />
    </button>
    <button on:click={deleteVideo} title="Delete video" class="video-action-btn danger-btn" aria-label="Delete node">
        <DeleteIcon size="16" />
    </button>
  </div>
</SmartElement>

<VideoIdCard bind:display={showIdCard} bind:video on:save={handleSave} />

<style>
  :global(.playlist-video-revamp) {
    padding: var(--space-4) var(--space-6);
    align-items: center;
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    transition: all 0.3s var(--easing-standard);
  }

  :global(.playlist-video-revamp:hover) {
    background: var(--hover);
    border-color: rgba(var(--primary-rgb), 0.3);
    transform: translateX(8px);
    box-shadow: 0 4px 12px var(--shadow);
  }

  .video-selection {
    margin-right: var(--space-4);
    display: flex;
    align-items: center;
  }

  .thumbnail-container {
    position: relative;
    width: 140px;
    height: 78px;
    margin-right: var(--space-6);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .watched-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(var(--bg), 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  .video-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    cursor: pointer;
    gap: var(--space-1);
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .video-title {
    font-weight: 800;
    font-size: var(--font-base);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  .predict-btn {
    background: linear-gradient(135deg, var(--primary), #d500f9);
    color: white;
    border: none;
    padding: 2px 10px;
    border-radius: var(--radius-sm);
    font-size: 10px;
    font-weight: 800;
    cursor: pointer;
    margin-bottom: var(--space-1);
    display: flex;
    align-items: center;
    gap: 4px;
    width: fit-content;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  :global(.playlist-video-revamp.is-watched) .video-title {
    opacity: 0.5;
    text-decoration: line-through;
  }

  .video-channel {
    font-size: var(--font-xs);
    font-weight: 700;
    color: var(--text-muted);
    opacity: 0.7;
  }

  .video-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: var(--space-6);
    gap: var(--space-3);
  }

  .video-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    background: var(--hover);
    border: 1px solid var(--border);
    color: var(--text-muted);
    transition: all 0.2s;
  }

  .video-action-btn:hover {
    color: white;
    background: var(--primary);
    border-color: var(--primary);
    transform: scale(1.1);
  }

  .danger-btn:hover {
    background: var(--danger);
    border-color: var(--danger);
  }
</style>
