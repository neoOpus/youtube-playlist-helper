<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { TerminalIcon, PlusMultiple, CheckIcon, CloseIcon, SuperButton, SuperInput, TagManager } from "@yph/ui-kit";
  import type { Video } from "@yph/core";

  interface Props {
    selectedVideos: Video[];
    display?: boolean;
    onapply: (action: string, value: any) => void;
    onclose: () => void;
  }

  let { selectedVideos, display = $bindable(false), onapply, onclose }: Props = $props();

  let tagValue = $state("");
  let ratingValue = $state(5);

  function applyTags() {
      if (!tagValue) return;
      onapply('tag', tagValue);
      tagValue = "";
  }

  function applyRating() {
      onapply('rating', ratingValue);
  }

  function applyWatched(val: boolean) {
      onapply('watched', val);
  }
</script>

{#if display}
  <div class="bulk-ops-overlay" transition:fade onclick={onclose}>
      <div class="bulk-container pro-glass-high" transition:fly={{ y: 20 }} onclick={e => e.stopPropagation()}>
          <div class="bulk-header">
              <div class="h-meta">
                  <TerminalIcon size="18" color="var(--primary)" />
                  <h3>Bulk Node Modulation</h3>
              </div>
              <button class="close-btn" onclick={onclose}><CloseIcon size="16" /></button>
          </div>

          <div class="bulk-body mt-6">
              <div class="bulk-section">
                  <span class="l">Inject Tags</span>
                  <div class="input-row">
                      <SuperInput bind:value={tagValue} placeholder="Identifier..." />
                      <SuperButton primary onclick={applyTags}><PlusMultiple size="16" /></SuperButton>
                  </div>
              </div>

              <div class="bulk-section mt-6">
                  <span class="l">Quality Overload</span>
                  <div class="input-row">
                      <input type="range" min="1" max="5" bind:value={ratingValue} class="pro-slider" />
                      <span class="v-label">{ratingValue}.0 ★</span>
                      <SuperButton primary onclick={applyRating}><CheckIcon size="16" /></SuperButton>
                  </div>
              </div>

              <div class="bulk-section mt-6">
                  <span class="l">State Modulation</span>
                  <div class="btn-grid">
                      <SuperButton outline onclick={() => applyWatched(true)}>Force Watched</SuperButton>
                      <SuperButton outline onclick={() => applyWatched(false)}>Force Unwatched</SuperButton>
                  </div>
              </div>
          </div>

          <div class="bulk-footer mt-8">
              <span class="muted">AFFECTING {selectedVideos.length} NODES IN CURRENT SECTOR</span>
          </div>
      </div>
  </div>
{/if}

<style>
    .bulk-ops-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
    .bulk-container { width: 450px; padding: 2rem; border-radius: var(--radius-2xl); box-shadow: var(--shadow-2xl); border: 1px solid var(--border-strong); }

    .bulk-header { display: flex; justify-content: space-between; align-items: center; }
    .h-meta { display: flex; align-items: center; gap: 12px; }
    .h-meta h3 { margin: 0; font-size: 1.1rem; }

    .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }

    .l { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px; }
    .input-row { display: flex; gap: 10px; align-items: center; }
    .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

    .v-label { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 0.9rem; min-width: 60px; }

    .pro-slider { flex-grow: 1; accent-color: var(--primary); }

    .bulk-footer { border-top: 1px solid var(--border); padding-top: 1rem; text-align: center; }
    .bulk-footer span { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.2em; }
</style>
