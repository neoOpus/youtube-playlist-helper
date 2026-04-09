<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { CloseIcon, SaveIcon, TerminalIcon, SuperButton } from "@yph/ui-kit";
  import type { Video } from "@yph/core";
  import { aiService, notificationService } from "@yph/core";

  interface Props {
    video: Video;
    display?: boolean;
  }

  let { video = $bindable(), display = $bindable(false) }: Props = $props();
  const dispatch = createEventDispatcher();
  let loadingAi = $state(false);

  function close() { display = false; }

  async function save() {
    dispatch("save", video);
    close();
    notificationService.success("Intelligence updated.");
  }

  async function runAiScan() {
      loadingAi = true;
      try {
          const res = await aiService.analyzeVideo(video);
          video.aiSummary = res.aiSummary;
          video.aiTags = res.aiTags;
          notificationService.success("AI Analysis Complete.");
      } finally {
          loadingAi = false;
      }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && display) {
      close();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if display}
  <div
    class="modal-overlay"
    transition:fade
    onclick={close}
    onkeydown={(e) => e.key === 'Enter' && close()}
    role="button"
    tabindex="0"
    aria-label="Close Video Intelligence Node Overlay"
  >
    <div
        class="modal-content pro-glass-high"
        transition:fly={{ y: 20 }}
        onclick={e => e.stopPropagation()}
        onkeydown={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-node-title"
        tabindex="-1"
    >
        <div class="modal-header">
            <TerminalIcon size="24" color="var(--primary)" />
            <h2 id="video-node-title">Video Intelligence Node</h2>
            <button class="close-btn" onclick={close} aria-label="Close"><CloseIcon size="20" /></button>
        </div>

        <div class="modal-body">
            <div class="meta-section">
                <span class="label">TITLE</span>
                <input bind:value={video.title} placeholder="Unknown Metadata..." aria-label="Video Title" />
            </div>

            <div class="grid-2 mt-6">
                <div class="meta-section">
                    <span class="label">RATING</span>
                    <select bind:value={video.rating} aria-label="Rating">
                        <option value={0}>Unrated</option>
                        {#each [1,2,3,4,5] as n}
                            <option value={n}>{n} Stars</option>
                        {/each}
                    </select>
                </div>
                <div class="meta-section">
                    <span class="label">STATUS</span>
                    <label class="check-label">
                        <input type="checkbox" bind:checked={video.watched} />
                        <span>Watched</span>
                    </label>
                </div>
            </div>

            <div class="meta-section mt-6">
                <span class="label">AI SUMMARY</span>
                {#if video.aiSummary}
                    <p class="summary-text">{video.aiSummary}</p>
                {:else}
                    <div class="ai-cta">
                        <p class="small muted">No intelligence found for this node.</p>
                        <SuperButton outline mini onclick={runAiScan} disabled={loadingAi}>
                            {loadingAi ? 'Processing...' : 'Infrastructure Scan'}
                        </SuperButton>
                    </div>
                {/if}
            </div>

            <div class="meta-section mt-6">
                <span class="label">LOCAL NOTES</span>
                <textarea bind:value={video.notes} placeholder="Enter observations..." aria-label="Local Notes"></textarea>
            </div>
        </div>

        <div class="modal-footer mt-8">
            <SuperButton onclick={save} >
                <SaveIcon size="18" /> Commit Updates
            </SuperButton>
        </div>
    </div>
  </div>
{/if}

<style>
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 6000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); border: none; cursor: default; }
    .modal-content { width: 500px; max-width: 90vw; padding: 2.5rem; position: relative; outline: none; cursor: auto; }
    .modal-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    h2 { margin: 0; font-weight: 900; flex-grow: 1; letter-spacing: -1px; font-size: var(--font-xl); }
    .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
    .close-btn:hover { color: var(--primary); }
    .meta-section { display: flex; flex-direction: column; gap: 8px; }
    .label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }
    input, select, textarea { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 12px; color: var(--text); font-weight: 600; font-size: 0.9rem; outline: none; }
    input:focus, select:focus, textarea:focus { border-color: var(--primary); }
    textarea { height: 100px; resize: none; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .check-label { display: flex; align-items: center; gap: 10px; cursor: pointer; height: 44px; padding: 0 12px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; font-weight: 700; font-size: 0.9rem; }
    .check-label input { width: 18px; height: 18px; accent-color: var(--primary); }
    .summary-text { font-size: 0.85rem; line-height: 1.6; color: var(--text); background: var(--hover); padding: 1rem; border-radius: 8px; border: 1px dashed var(--border-strong); }
    .ai-cta { background: rgba(255, 82, 82, 0.05); border: 1px solid rgba(255, 82, 82, 0.2); padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
</style>
