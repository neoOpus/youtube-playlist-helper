<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition"; import { cubicOut } from "svelte/easing";
  import type { Video } from "../../types/model";
  import SuperButton from "../ui/SuperButton.svelte";
  import SuperInput from "../ui/SuperInput.svelte";
  import { aiService } from "../../services/mega/ai-service";
  import Fa from "svelte-fa";
  import { faTimes, faRobot, faSave, faExternalLinkAlt, faPlayCircle, faEye } from "@fortawesome/free-solid-svg-icons";

  export let video: Video | null = null;
  export let isOpen = false;

  const dispatch = createEventDispatcher();
  let loadingAi = false;
  let showPlayer = false;

  async function analyze() {
    if (!video) return;
    loadingAi = true;
    try {
      const enrichment = await aiService.analyzeVideo(video);
      video = { ...video, ...enrichment };
    } finally {
      loadingAi = false;
    }
  }

  function save() {
    dispatch("save", video);
  }

  function close() {
    isOpen = false;
    showPlayer = false;
    dispatch("close");
  }

  $: embedUrl = video ? `https://www.youtube.com/embed/${video.videoId}?autoplay=1` : '';
</script>

{#if isOpen && video}
  <div class="video-sidebar" transition:fly={{ x: 400, duration: 500, easing: cubicOut }}>
    <header>
      <h3>Video Insights</h3>
      <button class="close-btn" on:click={close} aria-label="Close sidebar"><Fa icon={faTimes} /></button>
    </header>

    <div class="content">
      {#if showPlayer}
        <div class="player-container">
            <iframe
                title="YouTube Video Player"
                width="100%"
                height="200"
                src={embedUrl}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
            <SuperButton variant="ghost" on:click={() => showPlayer = false}>Stop Playback</SuperButton>
        </div>
      {:else}
        <div class="thumbnail-wrapper" on:click={() => showPlayer = true} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && (showPlayer = true)}>
            <img src={video.thumbnailUrl} alt={video.title} class="thumb" />
            <div class="play-overlay">
                <Fa icon={faPlayCircle} size="3x" />
                <span>Click to Play in Dashboard</span>
            </div>
        </div>
      {/if}

      <div class="info">
          <h4>{video.title}</h4>
          <span class="channel">{video.channel}</span>
      </div>

      <div class="actions-row">
          <SuperButton variant="ghost" title="Open on YouTube" on:click={() => window.open(video.url, '_blank')}>
              <Fa icon={faExternalLinkAlt} />
          </SuperButton>
          <SuperButton variant="ghost" title="Quick Preview" on:click={() => showPlayer = !showPlayer}>
              <Fa icon={faEye} />
          </SuperButton>
      </div>

      <hr />

      <section>
          <label for="video-notes">Personal Notes</label>
          <textarea id="video-notes" bind:value={video.notes} placeholder="Add persistent notes..."></textarea>
      </section>

      <section class="ai-enrichment">
          <div class="ai-header">
              <Fa icon={faRobot} />
              <span>AI Analysis</span>
          </div>
          {#if video.aiSummary}
              <p class="summary">{video.aiSummary}</p>
          {:else}
              <p class="placeholder">No analysis yet.</p>
          {/if}
          <SuperButton on:click={analyze} loading={loadingAi} disabled={loadingAi} variant="secondary">
              Run AI Diagnostics
          </SuperButton>
      </section>

      <div class="footer-actions">
          <SuperButton on:click={save} className="wide">
              <Fa icon={faSave} /> Save ID Card
          </SuperButton>
      </div>
    </div>
  </div>
{/if}

<style>
  .video-sidebar {
    position: fixed;
    top: 60px;
    right: 0;
    bottom: 30px;
    width: 350px;
    background: white;
    box-shadow: -4px 0 20px rgba(0,0,0,0.1);
    z-index: 200;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #eee;
  }

  header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  header h3 { margin: 0; font-size: 1.1rem; font-weight: bold; }

  .close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #888; }

  .content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .thumbnail-wrapper {
      position: relative;
      cursor: pointer;
      border-radius: 12px;
      overflow: hidden;
  }

  .play-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: 0;
      transition: opacity 0.2s;
      gap: 10px;
  }

  .thumbnail-wrapper:hover .play-overlay { opacity: 1; }

  .thumb { width: 100%; object-fit: cover; }

  .player-container {
      border-radius: 12px;
      overflow: hidden;
      background: #000;
  }

  .channel { color: #666; font-size: 0.85rem; }

  .actions-row { display: flex; gap: 8px; }

  section { display: flex; flex-direction: column; gap: 0.5rem; }
  label { font-weight: 700; font-size: 0.75rem; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }

  textarea {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 10px;
      height: 100px;
      resize: none;
      font-size: 0.9rem;
      background: #fafafa;
  }

  .ai-enrichment {
      background: #fdf2f2;
      padding: 1rem;
      border-radius: 12px;
      border: 1px dashed #f5c2c2;
  }

  .ai-header { display: flex; align-items: center; gap: 8px; font-weight: bold; color: #d32f2f; margin-bottom: 10px; font-size: 0.9rem; }

  .summary { font-size: 0.85rem; font-style: italic; line-height: 1.4; color: #444; }

  .placeholder { color: #aaa; font-size: 0.85rem; }

  .footer-actions { margin-top: auto; padding-top: 1rem; }
  :global(.wide) { width: 100%; }
</style>
