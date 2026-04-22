<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { actionLogger, lastAction } from "@yph/core";
  import { Undo2, X, AlertCircle } from "lucide-svelte";

  let visible = $state(false);
  let action = $derived($lastAction);

  $effect(() => {
    if (action) {
      visible = true;
      const timer = setTimeout(() => { visible = false; }, 5000);
      return () => clearTimeout(timer);
    }
  });

  async function undo() {
    await actionLogger.undo();
    visible = false;
  }
</script>

{#if visible && action}
  <div class="toast-wrapper" in:fly={{ y: 20 }} out:fade>
    <div class="toast surface-2">
      <div class="icon-wrap"><AlertCircle size="18" /></div>
      <div class="content">
        <span class="label">Action Recorded</span>
        <p class="msg">{action.label}</p>
      </div>
      <div class="actions">
        <button class="undo-btn" onclick={undo}>Undo</button>
        <button class="close-btn" onclick={() => visible = false}><X size="14" /></button>
      </div>
    </div>
  </div>
{/if}

<style>
  .toast-wrapper {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 2000;
  }
  .toast {
    display: flex; align-items: center; padding: 12px 16px; gap: 16px; border-radius: 12px;
    box-shadow: var(--shadow-lg); border: 1px solid var(--primary); min-width: 320px;
  }
  .icon-wrap { color: var(--primary); }
  .content { flex: 1; }
  .label { display: block; font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: var(--primary); letter-spacing: 0.05em; }
  .msg { font-size: 0.85rem; font-weight: 600; color: var(--text-main); margin: 0; }
  .actions { display: flex; align-items: center; gap: 12px; }
  .undo-btn {
      background: var(--primary); color: white; border: none; padding: 4px 12px; border-radius: 4px;
      font-size: 0.75rem; font-weight: 700; cursor: pointer;
  }
  .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
</style>
