<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import {
    SaveIcon,
    TerminalIcon,
    SearchIcon,
    CheckIcon,
    PlusMultiple,
    SuperButton,
    SuperInput,
    TagManager,
    Modal,
    ReverseIcon
  } from "@yph/ui-kit";
  import type { Video, VideoMetadata } from "@yph/core";
  import MetadataTimeMachine from "./MetadataTimeMachine.svelte";

  let { video = $bindable(), display = $bindable(false), onsave = (v: Video) => {} } = $props();

  let showTimeMachine = $state(false);

  async function handleSave() {
    onsave(video);
    display = false;
  }

  function handleRestore(meta: VideoMetadata) {
      video.watched = meta.watched;
      video.rating = meta.rating;
      video.aiTags = meta.aiTags;
      video.notes = meta.notes;
      video.aiSummary = meta.aiSummary;
  }
</script>

<Modal bind:display title="Node Intelligence: {video.videoId}">
  <div class="video-id-card">
    <div class="card-header">
        <img src={video.thumbnailUrl} alt="" class="card-hero" />
        <div class="hero-overlay">
            <h2 class="v-title">{video.title}</h2>
            <span class="v-chan">{video.channel}</span>
        </div>
    </div>

    <div class="card-controls mt-6">
        <div class="ctrl-section">
            <span class="l">Quality Frequency</span>
            <div class="rating-picker">
                {#each Array(5) as _, i}
                    <button
                        class="star"
                        class:active={(video.rating || 0) > i}
                        onclick={() => video.rating = i + 1}
                    >★</button>
                {/each}
            </div>
        </div>

        <div class="ctrl-section mt-6">
            <span class="l">Signature Tags</span>
            <TagManager bind:tags={video.aiTags} />
        </div>

        <div class="ctrl-section mt-6">
            <span class="l">Intelligence Notes</span>
            <textarea bind:value={video.notes} placeholder="Enter observation data..."></textarea>
        </div>
    </div>

    <div class="card-footer mt-8">
        <div class="footer-left">
            <SuperButton outline onclick={() => showTimeMachine = true}>
                <ReverseIcon size="16" /> Time Machine
            </SuperButton>
        </div>
        <div class="footer-right">
            <SuperButton primary onclick={handleSave}>
                <SaveIcon size="18" /> Sync Node
            </SuperButton>
        </div>
    </div>
  </div>
</Modal>

<MetadataTimeMachine
    videoId={video.videoId}
    bind:display={showTimeMachine}
    onrestore={handleRestore}
/>

<style>
  .video-id-card { padding: 0.5rem; }
  .card-header { position: relative; height: 180px; border-radius: var(--radius-xl); overflow: hidden; }
  .card-hero { width: 100%; height: 100%; object-fit: cover; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem; }
  .v-title { margin: 0; font-size: 1.25rem; font-weight: 900; color: white; line-height: 1.2; }
  .v-chan { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.7); }

  .l { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px; }

  .rating-picker { display: flex; gap: 8px; }
  .star { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--hover); transition: all 0.2s; }
  .star.active { color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  .star:hover { transform: scale(1.2); }

  textarea { width: 100%; height: 100px; background: var(--hover); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem; color: var(--text); font-weight: 600; resize: none; outline: none; }
  textarea:focus { border-color: var(--primary); }

  .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 1.5rem; }
</style>
