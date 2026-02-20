<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  export let show = false;
  export let commands: { id: string; title: string; subtitle?: string; action: () => void; icon?: any }[] = [];

  let query = '';
  let selectedIndex = 0;
  let inputElement: HTMLInputElement;

  $: filteredCommands = query
    ? commands.filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  $: {
      if (show && inputElement) {
          setTimeout(() => inputElement.focus(), 50);
      }
      if (!show) {
          query = '';
          selectedIndex = 0;
      }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      show = false;
    } else if (e.key === 'ArrowDown') {
      selectedIndex = (selectedIndex + 1) % filteredCommands.length;
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        show = false;
      }
    }
  }

  function close() {
    show = false;
  }
</script>

{#if show}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" on:mousedown={close} transition:fade={{ duration: 150 }}>
    <div
        class="palette"
        on:mousedown|stopPropagation
        transition:slide={{ duration: 200 }}
    >
      <div class="search-container">
        <input
          bind:this={inputElement}
          bind:value={query}
          placeholder="Type a command or search..."
          on:keydown={handleKeydown}
        />
      </div>

      <div class="results">
        {#each filteredCommands as command, i}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="command-item {i === selectedIndex ? 'selected' : ''}"
            on:click={() => { command.action(); show = false; }}
            on:mouseenter={() => selectedIndex = i}
          >
            {#if command.icon}
                <span class="icon">{@render command.icon()}</span>
            {/if}
            <div class="text">
              <div class="title">{command.title}</div>
              {#if command.subtitle}
                <div class="subtitle">{command.subtitle}</div>
              {/if}
            </div>
          </div>
        {:else}
          <div class="no-results">No commands found</div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    padding-top: 15vh;
    z-index: 5000;
  }

  .palette {
    width: 600px;
    max-width: 90vw;
    background: var(--bg-color, white);
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 60vh;
  }

  .search-container {
    padding: 16px;
    border-bottom: 1px solid var(--border-color, #eee);
  }

  input {
    width: 100%;
    border: none;
    font-size: 18px;
    background: transparent;
    color: var(--text-color, black);
    outline: none;
  }

  .results {
    overflow-y: auto;
    padding: 8px;
  }

  .command-item {
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background 0.1s;
  }

  .command-item.selected {
    background: rgba(0, 0, 0, 0.05);
  }

  .icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    opacity: 0.6;
  }

  .text {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .title {
    font-weight: 500;
    font-size: 14px;
  }

  .subtitle {
    font-size: 12px;
    opacity: 0.5;
  }

  .no-results {
    padding: 32px;
    text-align: center;
    opacity: 0.5;
    font-size: 14px;
  }
</style>
