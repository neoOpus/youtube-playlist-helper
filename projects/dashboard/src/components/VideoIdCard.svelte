<script lang="ts">
  import type { Video } from "@yph/core";
  import Modal from "./Modal.svelte";
  import {
    FloatingButton,
    SaveIcon,
    SearchIcon,
    TagManager,
    InfoIcon,
    ReverseIcon
  } from "@yph/ui-kit";
  import { createEventDispatcher, onMount } from "svelte";
  import { aiService, historyService, notificationService } from "@yph/core";
  import { fade, slide } from "svelte/transition";

  export let video: Video;
  export let display = false;
  let loadingAi = false;
  let history: any[] = [];
  let showHistory = false;

  const dispatch = createEventDispatcher();

  onMount(async () => {
      if (video.videoId) {
          history = await historyService.getHistory(video.videoId);
      }
  });

  async function analyze() {
    loadingAi = true;
    try {
      const enrichment = await aiService.analyzeVideo(video);
      video = { ...video, ...enrichment };
    } finally {
      loadingAi = false;
    }
  }

  function handleTagsChange(event: CustomEvent<string[]>) {
    video.aiTags = event.detail;
  }

  function restoreVersion(version: any) {
      video.title = version.title;
      video.channel = version.channel;
      notificationService.success("Metadata restored from history.");
  }

  function save() {
    dispatch("save", video);
    display = false;
  }
</script>

<Modal bind:display>
  <div
    class="video-id-card pro-glass p-6"
    role="dialog"
    aria-label="Video Intelligence Card for {video.title}"
  >
    <div class="id-header mb-6">
        <h3><InfoIcon size="20" color="var(--primary)" /> Video Intelligence Card</h3>
        <code class="small muted">{video.videoId}</code>
    </div>

    <div class="field">
      <label for="video-title">Title</label>
      <input id="video-title" type="text" bind:value={video.title} />
    </div>

    <div class="field mt-4">
      <label for="video-notes">Private Engineering Notes</label>
      <textarea id="video-notes" bind:value={video.notes} placeholder="Add persistent technical notes here..."></textarea>
    </div>

    <div class="row gap-6 mt-4">
        <div class="field flex-1">
          <label for="video-rating">Performance Rating (1-5)</label>
          <input id="video-rating" type="number" min="1" max="5" bind:value={video.rating} />
        </div>
        <div class="field checkbox-field flex-1">
            <label class="row items-center gap-2 cursor-pointer">
                <input id="video-watched" type="checkbox" bind:checked={video.watched} />
                <span class="bold">Mark as Analyzed</span>
            </label>
        </div>
    </div>

    <div class="ai-section mt-8">
        <div class="row justify-between items-center mb-4">
            <span class="section-title">AI Enrichment & Tags</span>
            <button on:click={analyze} disabled={loadingAi} class="btn-ai mini" aria-label="Run neural scan">
                {loadingAi ? 'Processing...' : 'Neural Scan'}
            </button>
        </div>

        {#if video.aiSummary}
            <div class="ai-summary" in:fade>
                <p>{video.aiSummary}</p>
            </div>
        {/if}

        <TagManager tags={video.aiTags || []} on:change={handleTagsChange} placeholder="Add semantic tag..." />
    </div>

    {#if history.length > 0}
        <div class="history-section mt-6">
            <button class="btn secondary mini w-full" on:click={() => showHistory = !showHistory} aria-expanded={showHistory}>
                <ReverseIcon size="14" /> {showHistory ? 'Hide' : 'View'} Metadata Time Machine ({history.length})
            </button>

            {#if showHistory}
                <div class="history-list mt-4" transition:slide>
                    {#each history as version}
                        <div class="history-item">
                            <div class="v-info">
                                <span class="v-title">{version.title}</span>
                                <span class="v-meta small muted">{version.channel} • {new Date(version.timestamp).toLocaleDateString()}</span>
                            </div>
                            <button class="btn primary mini" on:click={() => restoreVersion(version)}>Restore</button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}

    <div class="actions mt-8">
      <button class="btn primary-pro pro-glow w-full" on:click={save}>
        <SaveIcon size="18" /> Commit Changes to Infrastructure
      </button>
    </div>
  </div>
</Modal>

<style>
  .video-id-card { min-width: 500px; }
  .id-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
  h3 { margin: 0; font-weight: 900; letter-spacing: -1px; display: flex; align-items: center; gap: 10px; }

  .field { display: flex; flex-direction: column; gap: 8px; }
  label, .section-title { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

  input, textarea { background: var(--hover); border: 1px solid var(--border); color: var(--text); padding: 12px; border-radius: 12px; font-weight: 700; outline: none; }
  input:focus, textarea:focus { border-color: var(--primary); }
  textarea { height: 100px; resize: vertical; font-family: inherit; }

  .ai-section { background: rgba(255, 82, 82, 0.03); border: 1px dashed var(--primary); border-radius: 16px; padding: 1.5rem; }
  .ai-summary { background: var(--hover); padding: 1rem; border-radius: 10px; border-left: 3px solid var(--primary); margin-bottom: 1rem; font-size: 0.85rem; font-style: italic; color: var(--text); }

  .history-item { background: var(--hover); border: 1px solid var(--border); padding: 10px 14px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .v-info { display: flex; flex-direction: column; min-width: 0; }
  .v-title { font-weight: 800; font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .btn { padding: 12px 18px; border-radius: 10px; font-weight: 800; cursor: pointer; border: 1px solid var(--border); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--text); }
  .btn.primary { background: var(--primary); color: white; border-color: var(--primary); }
  .btn.primary-pro { background: var(--primary); color: white; border-color: var(--primary); }
  .btn.secondary { background: var(--hover); }
  .btn.mini { padding: 6px 12px; font-size: 0.7rem; }

  .btn-ai { background: linear-gradient(135deg, #6200ea, #d500f9); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 900; font-size: 0.75rem; cursor: pointer; }

  .row { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 0.5rem; }
  .gap-6 { gap: 1.5rem; }
  .mt-4 { margin-top: 1rem; }
  .mt-6 { margin-top: 1.5rem; }
  .mt-8 { margin-top: 2rem; }
  .mb-4 { margin-bottom: 1rem; }
  .p-6 { padding: 1.5rem; }
  .cursor-pointer { cursor: pointer; }
</style>
