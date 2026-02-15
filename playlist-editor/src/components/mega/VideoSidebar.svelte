<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import type { Video } from "../../types/model";
  import SuperButton from "../ui/SuperButton.svelte";
  import SuperInput from "../ui/SuperInput.svelte";
  import { aiService } from "../../services/mega/ai-service";
  import Fa from "svelte-fa";
  import { faTimes, faRobot, faSave, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

  export let video: Video | null = null;
  export let isOpen = false;

  const dispatch = createEventDispatcher();
  let loadingAi = false;

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
    dispatch("close");
  }
</script>

{#if isOpen && video}
  <div class="video-sidebar" transition:fly={{ x: 300, duration: 300 }}>
    <header>
      <h3>Video Insights</h3>
      <button class="close-btn" on:click={close}><Fa icon={faTimes} /></button>
    </header>

    <div class="content">
      <img src={video.thumbnailUrl} alt={video.title} class="thumb" />
      <div class="info">
          <h4>{video.title}</h4>
          <span class="channel">{video.channel}</span>
      </div>

      <div class="actions">
          <SuperButton variant="ghost" title="Open on YouTube" on:click={() => window.open(video.url, '_blank')}>
              <Fa icon={faExternalLinkAlt} />
          </SuperButton>
      </div>

      <hr />

      <section>
          <label for="video-notes">Notes</label>
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
    top: 60px; /* Header height */
    right: 0;
    bottom: 30px; /* StatusBar height */
    width: 350px;
    background: white;
    box-shadow: -4px 0 20px rgba(0,0,0,0.1);
    z-index: 50;
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

  header h3 { margin: 0; font-size: 1.2rem; }

  .close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #888; }

  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .thumb { width: 100%; border-radius: 8px; object-fit: cover; }
  .channel { color: #666; font-size: 0.9rem; }

  section { display: flex; flex-direction: column; gap: 0.5rem; }
  label { font-weight: 600; font-size: 0.8rem; color: #888; text-transform: uppercase; }

  textarea {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
      height: 100px;
      resize: none;
  }

  .ai-enrichment {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 12px;
      border: 1px dashed #ced4da;
  }

  .ai-header { display: flex; align-items: center; gap: 8px; font-weight: bold; color: var(--sidebar-bg-color); margin-bottom: 10px; }

  .summary { font-size: 0.85rem; font-style: italic; line-height: 1.4; color: #444; }

  .placeholder { color: #aaa; font-size: 0.85rem; }

  .footer-actions { margin-top: auto; padding-top: 1rem; }
  :global(.wide) { width: 100%; }
</style>
