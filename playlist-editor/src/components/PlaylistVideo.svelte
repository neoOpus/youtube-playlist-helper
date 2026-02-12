<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import DeleteIcon from "./icons/DeleteIcon.svelte";
  import InfoIcon from "./icons/InfoIcon.svelte";
  import SearchIcon from "./icons/SearchIcon.svelte";
  import CheckIcon from "./icons/CheckIcon.svelte";
  import type { Video } from "../types/model";
  import VideoIdCard from "./VideoIdCard.svelte";
  import SmartElement from "./SmartElement.svelte";
  import SuperButton from "./SuperButton.svelte";
  import SuperCheckbox from "./SuperCheckbox.svelte";
  import { metadataService } from "../services/metadata-service";
  import { alternativesService } from "../services/alternatives-service";

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
    // For now, just open Wayback Machine as a default or first choice
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
</script>

<SmartElement
  className="playlist-video {video.watched ? 'is-watched' : ''}"
  {active}
  selected={video.selected}
>
  <div class="video-selection" on:click|stopPropagation>
    <SuperCheckbox bind:checked={video.selected} />
  </div>
  {#if !disableThumbnails}
    <img
      alt={video.title}
      src={video.thumbnailUrl}
      on:click|preventDefault={videoClicked}
    />
  {/if}
  <div class="video-details">
    <span class="video-title">{video.title}</span>
    <span>{video.channel}</span>
  </div>
  <div class="video-btns">
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

<VideoIdCard bind:display={showIdCard} bind:video on:save={handleSave} />

<style>
  :global(.playlist-video) {
    padding: 0.5em 1em;
    align-items: center;
  }

  .video-selection {
    margin-right: 10px;
    display: flex;
    align-items: center;
  }

  :global(.video-action-btn) {
    color: var(--text-color) !important;
    box-shadow: none !important;
  }

  :global(.video-action-btn:hover) {
    background-color: rgba(0, 0, 0, 0.1) !important;
    transform: none !important;
  }

  :global(.playlist-video.is-watched) {
    opacity: 0.6;
  }

  :global(.playlist-video.is-watched) .video-title {
    text-decoration: line-through;
  }

  img {
    width: 120px;
    height: 65px;
    object-fit: cover;
  }

  .video-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0.5em;
    font-size: 16px;
  }

  .video-details > span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .video-title {
    font-weight: bold;
    width: 50vw;
  }

  .video-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
</style>
