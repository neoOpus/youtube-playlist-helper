<script lang="ts">
  import type { Video } from "@yph/core";
  import Modal from "./Modal.svelte";
  import {
    FloatingButton,
    SaveIcon,
    SearchIcon,
    TagManager
  } from "@yph/ui-kit";
  import { createEventDispatcher } from "svelte";
  import { aiService } from "@yph/core";

  export let video: Video;
  export let display = false;
  let loadingAi = false;

  const dispatch = createEventDispatcher();

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

  function save() {
    dispatch("save", video);
    display = false;
  }
</script>

<Modal bind:display>
  <div class="video-id-card">
    <h3>Video ID Card</h3>
    <div class="field">
      <label for="video-title">Title</label>
      <input id="video-title" type="text" bind:value={video.title} readonly />
    </div>
    <div class="field">
      <label for="video-notes">Notes</label>
      <textarea id="video-notes" bind:value={video.notes} placeholder="Add your private notes here..."></textarea>
    </div>
    <div class="field-row">
        <div class="field">
          <label for="video-rating">Rating (1-5)</label>
          <input id="video-rating" type="number" min="1" max="5" bind:value={video.rating} />
        </div>
        <div class="field checkbox-field">
            <input id="video-watched" type="checkbox" bind:checked={video.watched} />
            <label for="video-watched">
                Mark as Watched
            </label>
        </div>
    </div>

    <div class="field ai-section">
        <label for="video-ai">AI Enrichment & Tags</label>
        {#if video.aiSummary}
            <div class="ai-summary">
                <p>{video.aiSummary}</p>
            </div>
        {/if}
        <TagManager tags={video.aiTags || []} on:change={handleTagsChange} placeholder="Add tag..." />
        <button id="video-ai" on:click={analyze} disabled={loadingAi} class="ai-btn">
            {loadingAi ? 'Analyzing...' : 'Analyze with AI Agent'}
        </button>
    </div>
    <div class="actions">
      <FloatingButton on:click={save} title="Save Metadata" bgcolor="#28a745">
        <SaveIcon />
      </FloatingButton>
    </div>
  </div>
</Modal>

<style>
  .video-id-card {
    min-width: 450px;
    padding: 15px;
  }
  h3 {
    margin-top: 0;
    text-align: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  .field {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
  }
  .field-row {
    display: flex;
    gap: 20px;
    align-items: flex-end;
    margin-bottom: 15px;
  }
  .checkbox-field {
    flex-direction: row;
    align-items: center;
    padding-bottom: 8px;
  }
  .checkbox-field input {
    margin-right: 10px;
    width: auto;
  }
  label {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 0.9rem;
  }
  input[type="text"], input[type="number"], textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    background: var(--background-color);
    color: var(--text-color);
  }
  textarea {
    height: 80px;
    resize: vertical;
  }
  .ai-section {
    border: 1px dashed var(--sidebar-bg-color);
    padding: 15px;
    border-radius: 8px;
    background: rgba(255, 82, 82, 0.05);
    margin-top: 10px;
  }

  .ai-summary {
    font-size: 0.85rem;
    font-style: italic;
    margin-bottom: 12px;
    line-height: 1.4;
  }

  .ai-btn {
    margin-top: 15px;
    background: var(--sidebar-bg-color);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
  }

  .ai-btn:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
</style>
