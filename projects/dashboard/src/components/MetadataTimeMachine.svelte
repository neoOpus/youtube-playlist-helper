<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import {
      ReverseIcon,
      TerminalIcon,
      SuperButton,
      InfoIcon,
      PencilIcon
  } from "@yph/ui-kit";
  import { historyService, notificationService } from "@yph/core";
  import type { VideoHistoryEntry } from "@yph/core";

  interface Props {
      videoId: string;
      onRestore?: (entry: VideoHistoryEntry) => void;
  }

  let { videoId, onRestore = () => {} }: Props = $props();

  let history = $state<VideoHistoryEntry[]>([]);
  let loading = $state(true);

  onMount(async () => {
      history = await historyService.getHistory(videoId);
      loading = false;
  });
</script>

<div class="time-machine surface-1" in:fade>
    <div class="tm-header">
        <ReverseIcon size="20" color="var(--primary)" />
        <div class="tm-title">
            <h4>Metadata Time Machine</h4>
            <span class="tm-subtitle">Temporal restoration points for this node.</span>
        </div>
    </div>

    <div class="tm-body mt-4">
        {#if loading}
            <div class="tm-loading">
                <TerminalIcon size="18" class="spin" />
                <span>Scanning temporal database...</span>
            </div>
        {:else if history.length > 0}
            <div class="history-list">
                {#each history as entry, i}
                    <div class="history-item luminous-hover" in:fly={{ y: 10, delay: i * 50 }}>
                        <div class="entry-meta">
                            <span class="timestamp">{new Date(entry.timestamp).toLocaleString()}</span>
                            <span class="entry-val">{entry.title}</span>
                            <span class="entry-author">{entry.channel}</span>
                        </div>
                        <button class="restore-btn" onclick={() => {
                            onRestore(entry);
                            notificationService.success("Temporal restoration successful.");
                        }}>
                            <PencilIcon size="14" />
                            <span>Restore</span>
                        </button>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="tm-empty">
                <InfoIcon size="24" />
                <p>No prior temporal states detected for this node.</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .time-machine { padding: var(--space-6); border: 1px solid var(--border); border-radius: 16px; background: var(--bg-secondary); }
    .tm-header { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
    .tm-title h4 { margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--text); }
    .tm-subtitle { font-size: 0.65rem; color: var(--text-dim); font-weight: 700; display: block; }

    .tm-loading, .tm-empty {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        color: var(--text-dim);
        font-size: 0.75rem;
        font-weight: 700;
        text-align: center;
    }

    .history-list { display: flex; flex-direction: column; gap: 8px; }
    .history-item {
        background: var(--bg);
        border: 1px solid var(--border);
        padding: 12px;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
    }

    .entry-meta { display: flex; flex-direction: column; min-width: 0; }
    .timestamp { font-size: 0.6rem; font-weight: 800; color: var(--primary); font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
    .entry-val { font-size: 0.8rem; font-weight: 800; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .entry-author { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; }

    .restore-btn {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        color: var(--text);
        padding: 6px 12px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.7rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
    }

    .restore-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }

    :global(.spin) { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .mt-4 { margin-top: 1rem; }
</style>
