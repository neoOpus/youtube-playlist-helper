<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";
  import Fa from "svelte-fa";

  export let items: { label: string, icon: any, action: () => void, color?: string, danger?: boolean }[] = [];
  export let x = 0;
  export let y = 0;
  export let show = false;

  const dispatch = createEventDispatcher();

  function close() {
    show = false;
    dispatch("close");
  }

  onMount(() => {
    const clickOutside = (e: MouseEvent) => {
        if (show) close();
    };
    window.addEventListener('click', clickOutside);
    window.addEventListener('contextmenu', clickOutside);
    return () => {
        window.removeEventListener('click', clickOutside);
        window.removeEventListener('contextmenu', clickOutside);
    };
  });
</script>

{#if show}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="context-menu"
    style="top: {y}px; left: {x}px"
    transition:scale={{ duration: 150, start: 0.9, opacity: 0 }}
    on:click|stopPropagation
    role="menu"
    tabindex="-1"
  >
    {#each items as item}
      <button
        class="menu-item"
        class:danger={item.danger}
        on:click={() => { item.action(); close(); }}
        role="menuitem"
      >
        <div class="icon" style="color: {item.color || 'inherit'}">
          <Fa icon={item.icon} />
        </div>
        <span>{item.label}</span>
      </button>
    {/each}
  </div>
{/if}

<style>
  .context-menu {
    position: fixed;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1);
    padding: 6px;
    min-width: 180px;
    z-index: 5000;
    display: flex;
    flex-direction: column;
    gap: 2px;
    outline: none;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #444;
    transition: all 0.1s;
    width: 100%;
    text-align: left;
  }

  .menu-item:hover {
    background: #f4f4f5;
  }

  .menu-item.danger {
    color: #ef4444;
  }

  .menu-item.danger:hover {
    background: #fef2f2;
  }

  .icon {
    width: 16px;
    display: flex;
    justify-content: center;
    opacity: 0.8;
  }
</style>
