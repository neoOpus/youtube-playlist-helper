<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import {
    PlusMultiple,
    CloseIcon,
    SuperButton
  } from "@yph/ui-kit";
  import { storageService, notificationService } from "@yph/core";

  interface Props {
    display?: boolean;
  }

  let { display = $bindable(false) }: Props = $props();
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
        class="wizard-overlay"
        transition:fade
        onclick={close}
        onkeydown={(e) => e.key === 'Enter' && close()}
        role="button"
        tabindex="0"
        aria-label="Close Wizard Overlay"
    >
        <div
            class="wizard-content pro-glass-high"
            transition:fly={{ y: 20 }}
            onclick={e => e.stopPropagation()}
            onkeydown={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wizard-title"
            tabindex="-1"
        >
            <div class="wizard-header">
                <PlusMultiple size="24" color="var(--primary)" />
                <h2 id="wizard-title">Sync Protocol</h2>
                <button
                    class="close-btn"
                    onclick={close}
                    aria-label="Close"
                    title="Close Wizard"
                >
                    <CloseIcon size="20" />
                </button>
            </div>

            <div class="wizard-body">
                {#if step === 1}
                    <p>Paste your infrastructure JSON snapshot below to rebuild your local nodes.</p>
                    <textarea
                        bind:value={importData}
                        placeholder="JSON Infrastructure Map..."
                        aria-label="Import Data"
                    ></textarea>
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
    .wizard-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 7000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); padding: var(--space-5); border: none; cursor: default; }
    .wizard-content { width: 600px; max-width: 95vw; padding: 2.5rem; position: relative; outline: none; cursor: auto; }
    .wizard-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    h2 { margin: 0; font-weight: 900; flex-grow: 1; font-size: var(--font-xl); }
    .close-btn {
        background: var(--hover);
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        transition: all var(--duration-fast);
        padding: var(--space-2);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .close-btn:hover { color: var(--primary); background: var(--hover); transform: scale(1.1) rotate(90deg); }
    textarea { width: 100%; height: 250px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; color: var(--text); font-family: 'JetBrains Mono'; font-size: 0.8rem; resize: none; outline: none; }
    textarea:focus { border-color: var(--primary); }
    .wizard-footer { margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem; }
</style>
