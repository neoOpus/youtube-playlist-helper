<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { CloseIcon } from "@yph/ui-kit";

  let { display = $bindable(false), title = "", children } = $props();
  const dispatch = createEventDispatcher();

  function close() { display = false; dispatch("close"); }
</script>

{#if display}
  <div class="modal-overlay" transition:fade onclick={close}>
    <div class="modal-container pro-glass-high" transition:fly={{ y: 20 }} onclick={e => e.stopPropagation()}>
      <header class="modal-header">
        <h2>{title}</h2>
        <button class="close-btn" onclick={close} aria-label="Close"><CloseIcon size="20" /></button>
      </header>
      <div class="modal-body">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 6000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
  .modal-container { width: 500px; max-width: 90vw; padding: 2rem; border: 1px solid var(--border-strong); }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  h2 { margin: 0; font-weight: 900; }
  .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
</style>
