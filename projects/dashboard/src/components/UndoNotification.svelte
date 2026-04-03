<script lang="ts">
  import { lastAction, actionLogger } from "@yph/core";
  import { fade, fly } from "svelte/transition";

  $: action = $lastAction;

  async function handleUndo() {
    await actionLogger.undo();
  }

  function close() {
    lastAction.set(null);
  }
</script>

{#if action}
  <div class="undo-notification" in:fly={{ y: 50, duration: 300 }} out:fade>
    <span>{action.name} performed.</span>
    <button on:click={handleUndo}>Undo</button>
    <button class="close-btn" on:click={close}>×</button>
  </div>
{/if}

<style>
  .undo-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }

  button {
    background: none;
    border: 1px solid #777;
    color: #4da3ff;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #444;
  }

  .close-btn {
    border: none;
    color: #999;
    font-size: 20px;
    padding: 0;
  }
</style>
