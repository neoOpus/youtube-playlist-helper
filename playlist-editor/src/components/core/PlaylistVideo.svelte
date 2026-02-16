<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import DeleteIcon from "../icons/DeleteIcon.svelte";
  import InfoIcon from "../icons/InfoIcon.svelte";
  import SearchIcon from "../icons/SearchIcon.svelte";
  import CheckIcon from "../icons/CheckIcon.svelte";
  import type { Video } from "../../types/model";
  import VideoIdCard from "../mega/VideoIdCard.svelte";
  import SmartElement from "../ui/SmartElement.svelte";
  import SuperButton from "../ui/SuperButton.svelte";
  import SuperCheckbox from "../ui/SuperCheckbox.svelte";
  import { metadataService } from "../../services/mega/metadata-service";
  import { alternativesService } from "../../services/mega/alternatives-service";
  import Fa from "svelte-fa";
  import { faExclamationTriangle, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

  export let video: Video;
  export let active: boolean;
  export let disableThumbnails = false;

  const dispatch = createEventDispatcher();
  let isAvailable = true;
  let statusReason = "";

  onMount(async () => {
      const status = await alternativesService.checkVideoAvailability(video.videoId);
      isAvailable = status.available;
      statusReason = status.reason || "";
  });

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
    });
    dispatch("save", video);
  }

  function handleSelect(event: CustomEvent<{ checked: boolean; shiftKey: boolean }>) {
    dispatch("select", {
      ...event.detail,
      video,
    });
  }
</script>

<SmartElement
  className="playlist-video {video.watched ? 'is-watched' : ''} {!isAvailable ? 'is-unavailable' : ''}"
  {active}
  selected={video.selected}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="video-selection" on:click|stopPropagation on:keydown|stopPropagation role="presentation">
    <SuperCheckbox
      checked={video.selected}
      on:change={handleSelect}
    />
  </div>

  {#if !disableThumbnails}
    <button class="thumb-btn" on:click|preventDefault={videoClicked} aria-label="Play video">
      <img
        alt={video.title}
        src={video.thumbnailUrl}
        class:gray-scale={!isAvailable}
      />
      {#if !isAvailable}
        <div class="unavailable-overlay">
            <Fa icon={faExclamationTriangle} color="#ffc107" />
        </div>
      {/if}
    </button>
  {/if}

  <div class="video-details">
    <span class="video-title">
        {#if !isAvailable}
            <span class="warning-text">[MISSING]</span>
        {/if}
        {video.title}
    </span>
    <span class="video-channel">{video.channel}</span>
  </div>

  <div class="video-btns" on:click|stopPropagation on:keydown|stopPropagation role="toolbar" aria-label="Video actions" tabindex="0">
    {#if !isAvailable}
        <div class="alternatives-dropdown">
            <SuperButton on:click={trackDown} title="Find Mirror" variant="ghost" bgcolor="#ffc107" className="video-action-btn pulse">
                <Fa icon={faExternalLinkAlt} />
            </SuperButton>
        </div>
    {/if}
    <SuperButton on:click={trackDown} title="Track down alternatives" variant="ghost" className="video-action-btn"
      ><SearchIcon /></SuperButton
    >
    <SuperButton on:click={openIdCard} title="Video ID Card" variant="ghost" className="video-action-btn"
      ><InfoIcon /></SuperButton
    >
    <SuperButton on:click={deleteVideo} title="Delete video" variant="ghost" className="video-action-btn"
      ><DeleteIcon /></SuperButton
    >
  </div>
</SmartElement>

<VideoIdCard bind:display={showIdCard} bind:video on:save={handleSave} />

<style>
  :global(.playlist-video) { padding: 0.5em 1em; align-items: center; }
  .video-selection { margin-right: 10px; display: flex; align-items: center; }
  .thumb-btn { border: none; background: none; padding: 0; cursor: pointer; position: relative; }
  :global(.video-action-btn) { color: var(--text-color) !important; box-shadow: none !important; }
  :global(.video-action-btn:hover) { background-color: rgba(0, 0, 0, 0.1) !important; }
  :global(.playlist-video.is-watched) { opacity: 0.6; }
  :global(.playlist-video.is-watched) .video-title { text-decoration: line-through; }
  :global(.playlist-video.is-unavailable) { background-color: #fff9e6; }

  img { width: 120px; height: 65px; object-fit: cover; border-radius: 4px; }
  .gray-scale { filter: grayscale(1); opacity: 0.5; }

  .unavailable-overlay {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.6);
      padding: 5px;
      border-radius: 50%;
      display: flex;
  }

  .video-details { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-around; padding: 0.5em; font-size: 16px; overflow: hidden; }
  .video-details > span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .video-title { font-weight: bold; width: 100%; }
  .warning-text { color: #d97706; font-size: 0.8rem; margin-right: 5px; }
  .video-channel { font-size: 0.85rem; color: #666; }
  .video-btns { display: flex; justify-content: center; align-items: center; margin-left: 10px; }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  :global(.pulse) { animation: pulse 2s infinite; }
</style>
