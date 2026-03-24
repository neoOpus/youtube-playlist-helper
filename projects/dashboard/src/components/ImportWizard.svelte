<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import {
    PlusMultiple,
    CheckIcon,
    CloseIcon,
    SearchIcon,
    SuperButton
  } from "@yph/ui-kit";
  import { storageService, videoService, notificationService } from "@yph/core";

  let { display = $bindable(false) } = $props();
  const dispatch = createEventDispatcher();

  let step = $state(1);
  let importData = $state("");
  let processing = $state(false);

  function close() { display = false; step = 1; importData = ""; }

  async function runImport() {
      processing = true;
      try {
          const playlists = JSON.parse(importData);
          for (const pl of playlists) {
              await storageService.savePlaylist(pl);
          }
          notificationService.success("Infrastructure synchronized.");
          dispatch("complete");
          close();
      } catch (e) {
          notificationService.error("Synchronization failed: Invalid data map.");
      } finally {
          processing = false;
      }
  }
</script>

{#if display}
    <div class="wizard-overlay" transition:fade onclick={close}>
        <div class="wizard-content pro-glass-high" transition:fly={{ y: 20 }} onclick={e => e.stopPropagation()}>
            <div class="wizard-header">
                <PlusMultiple size="24" color="var(--primary)" />
                <h2>Sync Protocol</h2>
                <button class="close-btn" onclick={close} aria-label="Close"><CloseIcon size="20" /></button>
            </div>

            <div class="wizard-body">
                {#if step === 1}
                    <p>Paste your infrastructure JSON snapshot below to rebuild your local nodes.</p>
                    <textarea bind:value={importData} placeholder="JSON Infrastructure Map..."></textarea>
                {/if}
            </div>

            <div class="wizard-footer">
                <SuperButton outline onclick={close}>Cancel</SuperButton>
                <SuperButton primary onclick={runImport} disabled={!importData || processing}>
                    {processing ? 'Processing...' : 'Synchronize'}
                </SuperButton>
            </div>
        </div>
    </div>
{/if}

<style>
    .wizard-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 7000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); }
    .wizard-content { width: 600px; max-width: 95vw; padding: 2.5rem; position: relative; }
    .wizard-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    h2 { margin: 0; font-weight: 900; flex-grow: 1; }
    .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
    .close-btn:hover { color: var(--primary); }
    textarea { width: 100%; height: 250px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; color: var(--text); font-family: 'JetBrains Mono'; font-size: 0.8rem; resize: none; }
    .wizard-footer { margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem; }
</style>
