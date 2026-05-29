<svelte:options runes={true} />
<script lang="ts">
  import { actionLogger, lastAction } from "@yph/core";
  import type { Action } from "@yph/core";
  import { TerminalIcon, ReverseIcon } from "@yph/ui-kit";
  import { onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";

  let history = $state<Action[]>([]);

  onMount(() => {
      const update = () => {
          history = actionLogger.getHistory();
      };
      const unsubscribe = lastAction.subscribe(update);
      update();
      return unsubscribe;
  });
</script>

<div class="system-history pro-glass mt-8">
    <div class="history-header">
        <div class="meta">
            <TerminalIcon size="14" color="var(--primary)" />
            <span>AUDIT_TRAIL_STREAMS</span>
        </div>
        <button class="clear-link" onclick={() => actionLogger.clear()}>Clear Logs</button>
    </div>

    <div class="history-list mt-6">
        {#each history as action (action.id)}
            <div class="history-item" in:fly={{ x: 10, duration: 400 }} out:slide>
                <div class="item-main">
                    <span class="action-name">{action.name}</span>
                    <span class="timestamp">{new Date(action.timestamp).toLocaleTimeString()}</span>
                </div>
                <button class="undo-btn" onclick={() => actionLogger.undo()}>
                    <ReverseIcon size="12" /> Undo
                </button>
            </div>
        {:else}
            <div class="empty-history">
                <p>System protocols operational. No manual interventions recorded.</p>
            </div>
        {/each}
    </div>
</div>

<style>
    .system-history { padding: var(--space-6); }
    .history-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
    .meta { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; font-weight: 900; color: var(--primary); letter-spacing: 1px; }
    .clear-link { background: none; border: none; color: var(--text-dim); font-size: 10px; font-weight: 800; text-transform: uppercase; cursor: pointer; }
    .clear-link:hover { color: var(--primary); }

    .history-list { display: flex; flex-direction: column; gap: 4px; max-height: 250px; overflow-y: auto; padding-right: 8px; }
    .history-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid var(--border); }
    .item-main { display: flex; flex-direction: column; gap: 2px; }
    .action-name { font-size: 0.8rem; font-weight: 800; color: var(--text); }
    .timestamp { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--text-dim); font-weight: 700; }

    .undo-btn { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; background: var(--hover); color: var(--primary); font-size: 10px; font-weight: 900; text-transform: uppercase; cursor: pointer; border: 1px solid transparent; }
    .undo-btn:hover { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.1); }

    .empty-history { padding: 2rem; text-align: center; color: var(--text-dim); font-size: 11px; font-weight: 700; font-style: italic; }
</style>
