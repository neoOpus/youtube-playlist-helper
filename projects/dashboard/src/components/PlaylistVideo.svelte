<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    DeleteIcon,
    InfoIcon,
    SearchIcon,
    CheckIcon,
    SmartElement,
    SuperButton,
    SuperCheckbox,
    ContextMenu
  } from "@yph/ui-kit";
  import type { Video } from "@yph/core";
  import VideoIdCard from "./VideoIdCard.svelte";
  import { metadataService, alternativesService } from "@yph/core";

  export let video: Video;
  export let active: boolean;
  export let disableThumbnails = false;

  const dispatch = createEventDispatcher();

  function videoClicked() {
    window.open(video.url, "_blank");
  }

  function deleteVideo(_: Event) {
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

  let showContextMenu = false;
  let menuX = 0;
  let menuY = 0;

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    menuX = e.clientX;
    menuY = e.clientY;
    showContextMenu = true;
  }

  $: contextMenuItems = [
    { label: "Open in YouTube", action: videoClicked },
    { label: "Copy URL", action: () => {
        navigator.clipboard.writeText(video.url);
        if ((window as any).success) (window as any).success("Copied to clipboard");
    } },
    { label: video.watched ? "Mark as Unwatched" : "Mark as Watched", action: () => {
        video.watched = !video.watched;
        handleSave();
    }},
    { label: "Move to Top", action: () => dispatch("move", { direction: "top", video }) },
    { label: "Move to Bottom", action: () => dispatch("move", { direction: "bottom", video }) },
    { label: "Delete", danger: true, action: () => deleteVideo(null) }
  ];
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div on:contextmenu={handleContextMenu}>
    <SmartElement
      className="playlist-video {video.watched ? 'is-watched' : ''}"
      {active}
      selected={video.selected}
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
            aria-label="Play video"
        >
            <img
              alt={video.title}
              src={video.thumbnailUrl}
            />
            {#if video.watched}
                <div class="watched-overlay">
                    <CheckIcon size="24" color="white" />
                </div>
            {/if}
        </div>
      {/if}

      <div class="video-details" on:click={videoClicked} on:keydown={handleKeydown} role="button" tabindex="0">
        <div class="title-row">
            {#if video.watched}
                <span class="watched-badge">WATCHED</span>
            {/if}
            <span class="video-title">{video.title}</span>
        </div>
        <span class="video-channel">{video.channel}</span>
      </div>

      <div class="video-btns" on:click|stopPropagation on:keydown|stopPropagation role="presentation">
        <SuperButton on:click={trackDown} title="Track down alternatives" circle bgcolor="transparent" className="video-action-btn"
          ><SearchIcon /></SuperButton
        >
        <SuperButton on:click={openIdCard} title="Video ID Card" circle bgcolor="transparent" className="video-action-btn"
          ><InfoIcon /></SuperButton
        >
        <SuperButton on:click={deleteVideo} title="Delete video" circle bgcolor="transparent" className="video-action-btn"
          ><DeleteIcon /></SuperButton
        >
      </div>
    </SmartElement>
</div>

<VideoIdCard bind:display={showIdCard} bind:video on:save={handleSave} />

<ContextMenu
    bind:show={showContextMenu}
    x={menuX}
    y={menuY}
    items={contextMenuItems}
/>

<style>
  :global(.playlist-video) {
    padding: 0.5em 1em;
    align-items: center;
    border-left: 4px solid transparent;
  }

  :global(.playlist-video.is-selected) {
    border-left: 4px solid var(--sidebar-bg-color);
  }

  .video-selection {
    margin-right: 15px;
    display: flex;
    align-items: center;
  }

  .thumbnail-container {
    position: relative;
    width: 120px;
    height: 65px;
    margin-right: 10px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .watched-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
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
    padding: 0.5em;
    min-width: 0;
    cursor: pointer;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .video-title {
    font-weight: bold;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .watched-badge {
    background: #28a745;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
  }

  :global(.playlist-video.is-watched) .video-title {
    text-decoration: line-through;
    opacity: 0.7;
  }

  .video-channel {
    font-size: 14px;
    opacity: 0.8;
  }

  .video-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    gap: 5px;
  }

  :global(.video-action-btn) {
    color: var(--text-color) !important;
  }

  :global(.video-action-btn:hover) {
    background-color: rgba(0, 0, 0, 0.05) !important;
  }
</style>
