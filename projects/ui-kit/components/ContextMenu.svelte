<svelte:options runes={true} />
<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { onMount } from "svelte";

  interface MenuItem {
    label: string;
    icon?: any;
    onclick: () => void;
    danger?: boolean;
    disabled?: boolean;
  }

  interface Props {
    items: MenuItem[];
    display?: boolean;
    x?: number;
    y?: number;
    onclose?: () => void;
  }

  let { items, display = $bindable(false), x = 0, y = 0, onclose }: Props = $props();

  function close() {
    display = false;
    if (onclose) onclose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  onMount(() => {
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  });
</script>

{#if display}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="context-menu pro-glass-high"
    style="top: {y}px; left: {x}px"
    transition:scale={{ duration: 150, start: 0.95 }}
    onkeydown={handleKeydown}
    onclick={(e) => e.stopPropagation()}
  >
    {#each items as item}
      {@const Icon = item.icon}
      <button
        class="menu-item"
        class:danger={item.danger}
        class:disabled={item.disabled}
        onclick={() => { if (!item.disabled) { item.onclick(); close(); } }}
        disabled={item.disabled}
      >
        {#if Icon}
          <div class="icon-wrapper">
            <Icon size="16" />
          </div>
        {/if}
        <span>{item.label}</span>
      </button>
    {/each}
  </div>
{/if}

<style>
  .context-menu {
    position: fixed;
    z-index: 10000;
    min-width: 200px;
    padding: var(--space-2);
    display: flex;
    flex-direction: column;
    gap: 2px;
    border: 1px solid var(--border-strong);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border: none;
    background: transparent;
    color: var(--text);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all var(--duration-fast);
    text-align: left;
    font-size: var(--font-sm);
    font-weight: 700;
    width: 100%;
  }

  .menu-item:hover:not(.disabled) {
    background: var(--hover);
  }

  .menu-item.danger {
    color: #ff8a8a;
  }

  .menu-item.danger:hover:not(.disabled) {
      background: rgba(255, 82, 82, 0.1);
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
  }
</style>
