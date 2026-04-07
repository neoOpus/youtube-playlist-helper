<svelte:options runes={true} />
<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { CloseIcon } from "@yph/ui-kit";

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
    transition:fade
    onclick={close}
    onkeydown={(e) => e.key === 'Enter' && close()}
    role="button"
    tabindex="0"
    aria-label="Close Modal Overlay"
  >
    <div
      class="modal-container pro-glass-high"
      transition:fly={{ y: 20 }}
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
          <CloseIcon size="20" />
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
    background: rgba(0,0,0,0.5);
    z-index: 6000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    padding: var(--space-5);
    border: none;
    cursor: default;
  }

  .modal-container {
    width: 600px;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    padding: var(--space-8);
    border: 1px solid var(--border-strong);
    outline: none;
    cursor: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
  }

  h2 { margin: 0; font-weight: 900; font-size: var(--font-xl); }

  .close-btn {
    background: var(--hover);
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--space-2);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--duration-fast);
  }

  .close-btn:hover {
    background: var(--primary);
    color: white;
    transform: scale(1.1) rotate(90deg);
  }

  .modal-body {
    margin-top: var(--space-2);
  }
</style>
