<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { CloseIcon } from "@yph/ui-kit";

  export let display = false;
  const dispatch = createEventDispatcher();

  function close() {
    display = false;
    dispatch("close");
  }

  function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
  }
</script>

{#if display}
  <div role="presentation" class="modal-overlay" on:click={close} transition:fade={{ duration: 300 }}>
    <div
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      class="modal-container pro-glass"
      on:click|stopPropagation
      on:keydown={handleKeydown}
      in:fly={{ y: 20, duration: 500 }}
      out:scale={{ start: 0.95, duration: 200 }}
    >
      <button class="close-btn" on:click={close} aria-label="Close modal">
        <CloseIcon size="20" />
      </button>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000;
    padding: var(--space-5);
  }

  .modal-container {
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    padding: var(--space-6);
    outline: none;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
  }

  .close-btn {
    position: absolute;
    top: var(--space-6);
    right: var(--space-6);
    background: var(--hover);
    border: none;
    padding: var(--space-2);
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .close-btn:hover {
    background: var(--primary);
    color: white;
    transform: scale(1.1) rotate(90deg);
  }

  .content {
    margin-top: var(--space-3);
  }
</style>
