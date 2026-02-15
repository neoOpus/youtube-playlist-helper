<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let x = 0;
  export let y = 0;
  export let show = false;
  export let items: { label: string; action: () => void; icon?: any; danger?: boolean }[] = [];

  function close() {
    show = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }
</script>

{#if show}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="overlay" on:mousedown={close} on:contextmenu|preventDefault={close}></div>

  <div
    class="context-menu"
    style="top: {y}px; left: {x}px;"
    on:mousedown|stopPropagation
    on:keydown={handleKeydown}
  >
    <ul>
      {#each items as item}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <li
          class:danger={item.danger}
          on:click={() => { item.action(); close(); }}
        >
          {#if item.icon}
            <span class="icon">{@render item.icon()}</span>
          {/if}
          <span class="label">{item.label}</span>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .context-menu {
    position: fixed;
    background: var(--bg-color, white);
    color: var(--text-color, black);
    border: 1px solid var(--border-color, #ccc);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    min-width: 180px;
    border-radius: 6px;
    padding: 4px 0;
    font-family: sans-serif;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1999;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    transition: background 0.1s;
  }

  li:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  li.danger {
    color: #dc3545;
  }

  li.danger:hover {
    background: #fff5f5;
  }

  .icon {
    display: flex;
    align-items: center;
    width: 16px;
    height: 16px;
  }

  .label {
    flex-grow: 1;
  }
</style>
