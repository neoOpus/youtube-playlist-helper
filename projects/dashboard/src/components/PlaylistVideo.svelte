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
  className="playlist-video {video.watched ? 'is-watched' : ''}"
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
        class="thumbnail-container"
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
            <span class="watched-badge">WATCHED</span>
        {/if}
        <span class="video-title">{video.title}</span>
    </div>
    <span class="video-channel">{video.channel}</span>
  </div>

  <div class="video-btns" on:click|stopPropagation on:keydown|stopPropagation role="presentation">
    <SuperButton on:click={trackDown} title="Track down alternatives" circle bgcolor="transparent" className="video-action-btn" ariaLabel="Search alternatives">
        <SearchIcon />
    </SuperButton>
    <SuperButton on:click={openIdCard} title="Video ID Card" circle bgcolor="transparent" className="video-action-btn" ariaLabel="Open ID Card">
        <InfoIcon />
    </SuperButton>
    <SuperButton on:click={deleteVideo} title="Delete video" circle bgcolor="transparent" className="video-action-btn" ariaLabel="Delete node">
        <DeleteIcon />
    </SuperButton>
  </div>
</SmartElement>

<VideoIdCard bind:display={showIdCard} bind:video on:save={handleSave} />

<style>
  :global(.playlist-video) {
    padding: 0.75rem 1rem;
    align-items: center;
    border-radius: 12px;
    margin-bottom: 0.5rem;
    background: var(--hover);
  }

  :global(.playlist-video:hover) {
    background: rgba(255, 255, 255, 0.06);
  }

  .video-selection {
    margin-right: 1rem;
    display: flex;
    align-items: center;
  }

  .thumbnail-container {
    position: relative;
    width: 120px;
    height: 68px;
    margin-right: 1rem;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .watched-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
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
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
  }

  .video-title {
    font-weight: 800;
    font-size: 1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--text);
  }

  .watched-badge {
    background: #28a745;
    color: white;
    font-size: 0.6rem;
    padding: 1px 5px;
    border-radius: 4px;
    font-weight: 900;
    flex-shrink: 0;
  }

  .predict-btn {
    background: linear-gradient(135deg, #6200ea, #d500f9);
    color: white;
    border: none;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 800;
    cursor: pointer;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    width: fit-content;
  }

  :global(.playlist-video.is-watched) .video-title {
    opacity: 0.6;
    text-decoration: line-through;
  }

  .video-channel {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .video-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1rem;
    gap: 0.5rem;
  }

  :global(.video-action-btn) {
    color: var(--text-muted) !important;
  }

  :global(.video-action-btn:hover) {
    color: var(--primary) !important;
  }
</style>
