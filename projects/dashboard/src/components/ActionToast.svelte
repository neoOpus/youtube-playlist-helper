<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { lastAction, actionLogger } from "@yph/core";
  import { CloseIcon, ReverseIcon, SuperButton } from "@yph/ui-kit";

  async function handleUndo() {
      await actionLogger.undo();
  }
</script>

{#if $lastAction}
  <div class="toast-wrapper" in:fly={{ y: 50, duration: 500 }} out:fade>
    <div class="toast pro-glass-high aura-glow">
        <div class="toast-content">
            <span class="message">{$lastAction.name}</span>
            <div class="divider"></div>
            <SuperButton outline on:click={handleUndo}>
                <ReverseIcon size="14" /> Undo
            </SuperButton>
        </div>
        <div class="progress-bar"></div>
    </div>
  </div>
{/if}

<style>
  .toast-wrapper {
    position: fixed;
    bottom: var(--space-8);
    right: var(--space-8);
    z-index: 2000;
  }

  .toast {
    padding: var(--space-4) var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    min-width: 320px;
    position: relative;
    overflow: hidden;
  }

  .toast-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-6);
  }

  .message {
      font-size: var(--font-sm);
      font-weight: 800;
      color: var(--text);
  }

  .divider {
      width: 1px;
      height: 24px;
      background: var(--border-strong);
  }

  .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: var(--primary);
      animation: progress 10s linear forwards;
  }

  @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
  }
</style>
