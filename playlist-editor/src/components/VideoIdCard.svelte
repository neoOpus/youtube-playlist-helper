<script lang="ts">
  import type { Video } from "../types/model.js";
  import Modal from "./Modal.svelte";
  import FloatingButton from "./FloatingButton.svelte";
  import SaveIcon from "./icons/SaveIcon.svelte";
  import SearchIcon from "./icons/SearchIcon.svelte";
  import { createEventDispatcher } from "svelte";
  import { aiService } from "../services/ai-service";

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

  function save() {
    dispatch("save", video);
    display = false;
  }
</script>

<Modal bind:display>
  <div class="video-id-card">
    <h3>Video ID Card</h3>
    <div class="field">
      <label for="title">Title</label>
      <input id="title" type="text" bind:value={video.title} readonly />
    </div>
    <div class="field">
      <label for="notes">Notes</label>
      <textarea id="notes" bind:value={video.notes} placeholder="Add your private notes here..."></textarea>
    </div>
    <div class="field">
      <label for="rating">Rating (1-5)</label>
      <input id="rating" type="number" min="1" max="5" bind:value={video.rating} />
    </div>
    <div class="field">
        <label>
            <input type="checkbox" bind:checked={video.watched} />
            Mark as Watched
        </label>
    </div>
    <div class="field ai-section">
        <label>AI Enrichment</label>
        {#if video.aiSummary}
            <div class="ai-summary">
                <p>{video.aiSummary}</p>
                <div class="tags">
                    {#each video.aiTags || [] as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            </div>
        {/if}
        <button on:click={analyze} disabled={loadingAi} class="ai-btn">
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
    min-width: 400px;
    padding: 10px;
  }
  h3 {
    margin-top: 0;
    text-align: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
  .field {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
  }
  label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  input[type="text"], input[type="number"], textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
  textarea {
    height: 100px;
    resize: vertical;
  }
  .ai-section {
    border: 1px dashed var(--sidebar-bg-color);
    padding: 10px;
    border-radius: 4px;
    background: rgba(255, 82, 82, 0.05);
  }

  .ai-summary {
    font-size: 0.85rem;
    font-style: italic;
    margin-bottom: 10px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .tag {
    background: var(--sidebar-bg-color);
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.75rem;
  }

  .ai-btn {
    margin-top: 5px;
    background: var(--sidebar-bg-color);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  .ai-btn:disabled {
    opacity: 0.6;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>
