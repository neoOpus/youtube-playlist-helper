<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { CloseIcon } from '@yph/ui-kit/components/icons';
  import { SimpleButton } from '@yph/ui-kit';

  const dispatch = createEventDispatcher();

  interface Props {
    title?: string;
    show?: boolean;
    maxWidth?: string;
    children?: any;
    footer?: any;
  }

  let {
    title = '',
    show = $state(false),
    maxWidth = '500px',
    children,
    footer
  }: Props = $props();

  function close() {
    dispatch('close');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="modal-backdrop"
    transition:fade={{ duration: 200 }}
    on:click={close}
    aria-hidden="true"
  >
    <div
      class="modal-container"
      style="max-width: {maxWidth}"
      transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
      on:click|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <header class="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button class="close-btn" onclick={close} aria-label="Close Modal">
          <CloseIcon size={20} />
        </button>
      </header>

      <main class="modal-body">
        {@render children?.()}
      </main>

      {#if footer}
        <footer class="modal-footer">
          {@render footer()}
        </footer>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    padding: var(--spacing-4);
  }

  .modal-container {
    background: var(--bg-surface);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg), var(--shadow-glow);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-6) var(--spacing-8);
    border-bottom: 1px solid var(--border-subtle);
  }

  h2 {
    margin: 0;
    font-size: var(--size-lg);
    font-weight: 700;
    color: var(--text-primary);
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-2);
    border-radius: var(--radius-sm);
    transition: all var(--trans-fast);
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
  }

  .modal-body {
    padding: var(--spacing-8);
    overflow-y: auto;
    max-height: 70vh;
  }

  .modal-footer {
    padding: var(--spacing-6) var(--spacing-8);
    background: rgba(0, 0, 0, 0.2);
    border-top: 1px solid var(--border-subtle);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-4);
  }
</style>
