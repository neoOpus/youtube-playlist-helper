<script lang="ts">
  import { actionLogger } from '@yph/core';
  import { fade, fly, scale } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import { CheckIcon, InfoIcon, CloseIcon } from '@yph/ui-kit/components/icons';

  const lastAction = actionLogger.lastAction;
  let visible = $state(false);
  let currentAction = $state<any>(null);

  lastAction.subscribe(val => {
    if (val) {
      currentAction = val;
      visible = true;
      setTimeout(() => visible = false, 4000);
    }
  });

  // Haptic-style audio feedback on toast
  function playHaptic(status: string) {
    if (typeof window !== 'undefined' && (window as any).audioContext) {
      // Implementation logic...
    }
  }

  $effect(() => {
    if (visible && currentAction) {
      playHaptic(currentAction.status);
    }
  });
</script>

{#if visible && currentAction}
  <div
    class="toast-container {currentAction.status.toLowerCase()}"
    in:fly={{ y: 50, duration: 400, easing: backOut }}
    out:fade={{ duration: 200 }}
  >
    <div class="icon-glow">
      {#if currentAction.status === 'Success'}
        <CheckIcon size={18} />
      {:else}
        <InfoIcon size={18} />
      {/if}
    </div>
    <div class="toast-content">
      <span class="toast-title">{currentAction.type}</span>
      <span class="toast-status">{currentAction.status}</span>
    </div>
    <button class="close-btn" onclick={() => visible = false}>
      <CloseIcon size={14} />
    </button>
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    bottom: 32px;
    right: 32px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 20px;
    background: var(--bg-glass-heavy);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-lg), 0 0 20px rgba(0, 0, 0, 0.4);
    z-index: 5000;
    min-width: 280px;
  }

  .success { border-left: 4px solid #00ff80; }
  .pending { border-left: 4px solid var(--accent-color); }
  .failure { border-left: 4px solid #ff3232; }

  .icon-glow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
  }

  .success .icon-glow { background: rgba(0, 255, 128, 0.1); color: #00ff80; }

  .toast-content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .toast-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .toast-status {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
  }
</style>
