<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SuperButton from "../ui/SuperButton.svelte";
  import DeleteIcon from "../icons/DeleteIcon.svelte";
  import CheckIcon from "../icons/CheckIcon.svelte";
  import { fade, slide } from "svelte/transition";

  export let selectedCount = 0;

  const dispatch = createEventDispatcher();
</script>

{#if selectedCount > 0}
  <div class="bulk-action-bar" transition:slide>
    <div class="info">
      <span class="count">{selectedCount}</span> item{selectedCount > 1 ? 's' : ''} selected
    </div>
    <div class="actions">
      <SuperButton on:click={() => dispatch('markWatched', true)} title="Mark as Watched" bgcolor="#28a745">
        <CheckIcon />
      </SuperButton>
      <SuperButton on:click={() => dispatch('delete')} title="Delete Selected" bgcolor="#dc3545">
        <DeleteIcon />
      </SuperButton>
      <SuperButton on:click={() => dispatch('clearSelection')} title="Clear Selection" bgcolor="#6c757d">
        ✕
      </SuperButton>
    </div>
  </div>
{/if}

<style>
  .bulk-action-bar {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: #222;
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }

  .info {
    font-weight: bold;
  }

  .count {
    background: var(--sidebar-bg-color);
    padding: 2px 8px;
    border-radius: 10px;
    margin-right: 5px;
  }

  .actions {
    display: flex;
    gap: 10px;
  }
</style>
