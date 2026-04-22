<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { X } from "lucide-svelte";
  import { appState } from "../stores/theme.svelte";

  interface Props {
    display?: boolean;
    title?: string;
    children?: import("svelte").Snippet;
  }

  let { display = $bindable(false), title = "", children }: Props = $props();
  const dispatch = createEventDispatcher();

  function close() {
    display = false;
    dispatch("close");
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
    transition:fade={{ duration: 200 }}
    onclick={close}
    onkeydown={(e) => e.key === 'Enter' && close()}
    role="button"
    tabindex="0"
    aria-label="Close Modal Overlay"
  >
    <div
      class="modal-container surface-2"
      transition:fly={{ y: 10, duration: appState.reducedMotion ? 0 : 300 }}
      onclick={e => e.stopPropagation()}
      onkeydown={e => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
    >
      <header class="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button
          class="close-btn"
          onclick={close}
          aria-label="Close"
          title="Close Modal"
        >
          <X size="20" />
        </button>
      </header>
      <div class="modal-body">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 6000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5);
  }

  .modal-container {
    width: 640px;
    max-width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    padding: var(--space-10);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-strong);
    outline: none;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-8);
  }

  h2 { margin: 0; font-weight: 800; font-size: 1.5rem; letter-spacing: -0.02em; }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--space-2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: var(--border-subtle);
    color: var(--text-main);
  }

  .modal-body {
    position: relative;
  }
</style>
