<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { actionService } from "../../services/mega/action-service";
  import Fa from "svelte-fa";
  import * as Icons from "@fortawesome/free-solid-svg-icons";

  export let isOpen = false;
  export let context: any = {};

  const dispatch = createEventDispatcher();
  const actions = actionService.actionsStore;
  let query = "";
  let selectedIndex = 0;
  let inputElement: HTMLInputElement;

  $: filteredActions = $actions.filter(a =>
      a.label.toLowerCase().includes(query.toLowerCase())
  );

  function handleKeyDown(e: KeyboardEvent) {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredActions.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredActions.length) % filteredActions.length;
    } else if (e.key === 'Enter') {
      executeSelected();
    }
  }

  function executeSelected() {
    const action = filteredActions[selectedIndex];
    if (action) {
      actionService.executeAction(action.id, context);
      close();
    }
  }

  function close() {
    isOpen = false;
    query = "";
    dispatch("close");
  }

  onMount(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen = !isOpen;
        if (isOpen) {
            setTimeout(() => inputElement?.focus(), 50);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  });
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="palette-overlay"
    on:click={close}
    on:keydown={(e) => e.key === 'Escape' && close()}
    transition:fade={{ duration: 150 }}
    role="button"
    aria-label="Close Palette"
    tabindex="-1"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
        class="palette-content"
        on:click|stopPropagation
        transition:fly={{ y: -20, duration: 200 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
    >
      <h2 id="command-palette-title" class="sr-only">Command Palette</h2>
      <div class="search-box">
        <Fa icon={Icons.faSearch} />
        <input
          bind:this={inputElement}
          bind:value={query}
          placeholder="Type a command or action..."
          on:keydown={handleKeyDown}
          aria-autocomplete="list"
          aria-controls="action-list"
        />
        <span class="kbd">ESC</span>
      </div>

      <div id="action-list" class="action-list" role="listbox">
        {#each filteredActions as action, i}
          <button
            class="action-item"
            class:selected={i === selectedIndex}
            on:click={() => { selectedIndex = i; executeSelected(); }}
            on:mouseenter={() => selectedIndex = i}
            role="option"
            aria-selected={i === selectedIndex}
            tabindex={i === selectedIndex ? 0 : -1}
          >
            <div class="icon-box" style="background-color: {action.color}20; color: {action.color}">
              <Fa icon={Icons[action.icon] || Icons.faBolt} />
            </div>
            <div class="action-info">
              <span class="label">{action.label}</span>
              <span class="scope: {action.scope}">Scope: {action.scope}</span>
            </div>
            {#if i === selectedIndex}
                <span class="enter-badge">⏎ Enter</span>
            {/if}
          </button>
        {:else}
          <div class="empty">No actions found.</div>
        {/each}
      </div>

      <div class="palette-footer">
        <div class="hint"><span class="kbd">↑↓</span> to navigate</div>
        <div class="hint"><span class="kbd">⏎</span> to execute</div>
      </div>
    </div>
  </div>
{/if}

<style>
  .palette-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    padding-top: 15vh;
    z-index: 2000;
    border: none;
    cursor: default;
  }

  .palette-content {
    width: 600px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    cursor: default;
  }

  .search-box {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    gap: 12px;
    border-bottom: 1px solid #eee;
  }

  .search-box input {
    flex: 1;
    border: none;
    font-size: 1.1rem;
    outline: none;
    background: transparent;
  }

  .action-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .action-item {
    display: flex;
    width: 100%;
    text-align: left;
    border: none;
    background: none;
    align-items: center;
    padding: 10px 12px;
    border-radius: 10px;
    gap: 12px;
    cursor: pointer;
    transition: background 0.1s;
  }

  .action-item.selected {
    background: #f0f0f0;
  }

  .icon-box {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .action-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .label { font-weight: 600; font-size: 0.95rem; color: #333; }
  .scope { font-size: 0.75rem; color: #888; text-transform: uppercase; }

  .kbd {
      background: #eee;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1px 4px;
      font-size: 0.7rem;
      font-weight: bold;
      color: #666;
  }

  .enter-badge {
      font-size: 0.75rem;
      color: #999;
  }

  .palette-footer {
    padding: 8px 16px;
    background: #fafafa;
    border-top: 1px solid #eee;
    display: flex;
    gap: 20px;
  }

  .hint { font-size: 0.75rem; color: #888; }

  .empty { padding: 2rem; text-align: center; color: #aaa; }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
</style>
