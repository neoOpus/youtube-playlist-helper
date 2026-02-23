<script lang="ts">
  import type { Video } from "../../types/model.js";
  import Modal from "../ui/Modal.svelte";
  import FloatingButton from "../ui/FloatingButton.svelte";
  import SaveIcon from "../icons/SaveIcon.svelte";
  import { createEventDispatcher } from "svelte";
  import { aiService } from "../../services/mega/ai-service";
  import Fa from "svelte-fa";
  import { faRobot, faShieldAlt, faMicrochip, faExternalLinkAlt, faLightbulb } from "@fortawesome/free-solid-svg-icons";

  export let video: any; // Using any because we added dynamic fields
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
    <header>
        <h3><Fa icon={faMicrochip} /> Video ID Card</h3>
        {#if video.isClickbait}
            <div class="clickbait-warning">
                <Fa icon={faShieldAlt} /> AI CLICKBAIT DETECTED
            </div>
        {/if}
    </header>

    <div class="scroll-area">
        <div class="field">
            <label for="title">Title</label>
            <input id="title" type="text" bind:value={video.title} readonly />
        </div>

        <div class="field">
            <label for="notes">Private Notes</label>
            <textarea id="notes" bind:value={video.notes} placeholder="Reflections, bookmarks, or thoughts..."></textarea>
        </div>

        <div class="row">
            <div class="field half">
                <label for="rating">Rating (1-5)</label>
                <input id="rating" type="number" min="1" max="5" bind:value={video.rating} />
            </div>
            <div class="field half center">
                <label class="check-label">
                    <input type="checkbox" bind:checked={video.watched} />
                    Mark as Watched
                </label>
            </div>
        </div>

        <div class="ai-hub">
            <div class="hub-header">
                <h4><Fa icon={faRobot} /> Intelligence Insights</h4>
                <button on:click={analyze} disabled={loadingAi} class="analyze-btn">
                    {loadingAi ? 'Synthesizing...' : 'Refresh AI Data'}
                </button>
            </div>

            {#if video.aiSummary}
                <div class="insight-card">
                    <p class="summary">{video.aiSummary}</p>

                    {#if video.aiKeyLearnings && video.aiKeyLearnings.length > 0}
                        <div class="learnings">
                            <h5><Fa icon={faLightbulb} /> Key Learnings</h5>
                            <ul>
                                {#each video.aiKeyLearnings as learning}
                                    <li>{learning}</li>
                                {/each}
                            </ul>
                        </div>
                    {/if}

                    {#if video.mirrors && video.mirrors.length > 0}
                        <div class="mirrors">
                            <h5><Fa icon={faExternalLinkAlt} /> Verified Mirrors</h5>
                            <div class="mirror-chips">
                                {#each video.mirrors as mirror}
                                    <a href={mirror.url} target="_blank" class="mirror-chip">{mirror.platform}</a>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            {:else}
                <p class="empty-ai">No intelligence gathered yet. Click refresh to analyze.</p>
            {/if}
        </div>
    </div>

    <div class="actions">
      <FloatingButton on:click={save} title="Commit to Permanent Library" bgcolor="#10b981">
        <SaveIcon />
      </FloatingButton>
    </div>
  </div>
</Modal>

<style>
  .video-id-card {
    min-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }

  h3 { margin: 0; font-size: 1.2rem; display: flex; align-items: center; gap: 10px; }

  .clickbait-warning {
    background: #fef2f2;
    color: #ef4444;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #fee2e2;
  }

  .scroll-area {
    overflow-y: auto;
    flex: 1;
    padding-right: 10px;
  }

  .field { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 6px; }
  label { font-weight: 600; font-size: 0.85rem; color: #475569; }

  input[type="text"], input[type="number"], textarea {
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
    background: #f8fafc;
  }

  .row { display: flex; gap: 1rem; }
  .half { flex: 1; }
  .center { justify-content: center; }
  .check-label { flex-direction: row; align-items: center; cursor: pointer; }

  .ai-hub {
    background: #f5f3ff;
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid #ddd6fe;
    margin-top: 1rem;
  }

  .hub-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  h4 { margin: 0; font-size: 0.9rem; color: #6d28d9; display: flex; align-items: center; gap: 8px; }

  .analyze-btn {
    background: #7c3aed;
    color: white;
    border: none;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
    font-weight: 600;
  }

  .analyze-btn:disabled { opacity: 0.5; }

  .insight-card { display: flex; flex-direction: column; gap: 1rem; }
  .summary { font-size: 0.9rem; font-style: italic; color: #4b5563; line-height: 1.5; }

  h5 { margin: 0 0 0.5rem 0; font-size: 0.8rem; color: #1f2937; display: flex; align-items: center; gap: 6px; }

  .learnings ul { margin: 0; padding-left: 1.2rem; font-size: 0.85rem; color: #4b5563; }
  .learnings li { margin-bottom: 4px; }

  .mirror-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .mirror-chip {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    text-decoration: none;
    color: #3b82f6;
    transition: all 0.2s;
  }
  .mirror-chip:hover { border-color: #3b82f6; background: #eff6ff; }

  .empty-ai { font-size: 0.85rem; color: #94a3b8; text-align: center; font-style: italic; }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }
</style>
