<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { historyService, notificationService } from "@yph/core";
  import type { VideoMetadata } from "@yph/core";
  import { TerminalIcon, ReverseIcon, SuperButton, Modal } from "@yph/ui-kit";

  interface Props {
    videoId: string;
    display?: boolean;
    onrestore: (meta: VideoMetadata) => void;
  }

  let { videoId, display = $bindable(false), onrestore }: Props = $props();

  let history = $state<any[]>([]);
  let loading = $state(true);

  onMount(async () => {
      history = await historyService.getVideoHistory(videoId);
      loading = false;
  });

  async function restoreVersion(v: any) {
      if (confirm(`Restore node metadata to snapshot from ${new Date(v.timestamp).toLocaleString()}?`)) {
          onrestore(v.metadata);
          notificationService.success("Infrastructure snapshot restored.");
          display = false;
      }
  }
</script>

<Modal bind:display title="Metadata Time Machine">
    <div class="time-machine-view">
        <div class="tm-header">
            <div class="h-icon"><ReverseIcon size="20" color="var(--primary)" /></div>
            <p class="muted">Browse and recover historical intelligence signatures for this node.</p>
        </div>

        <div class="history-list mt-8">
            {#if loading}
                <p>Decoding temporal fragments...</p>
            {:else if history.length === 0}
                <div class="empty-tm">
                    <TerminalIcon size="48" color="var(--border-strong)" />
                    <p>No historical fragments found for this identifier.</p>
                </div>
            {:else}
                {#each history.sort((a,b) => b.timestamp - a.timestamp) as entry}
                    <div class="history-card pro-glass">
                        <div class="card-meta">
                            <span class="ts">{new Date(entry.timestamp).toLocaleString()}</span>
                            <span class="action-tag">{entry.action || 'SYNCHRONIZE'}</span>
                        </div>
                        <div class="card-details mt-4">
                            <div class="d-row"><span>Rating</span> <span>{entry.metadata.rating || 'N/A'} ★</span></div>
                            <div class="d-row"><span>Watched</span> <span>{entry.metadata.watched ? 'YES' : 'NO'}</span></div>
                            <div class="d-row"><span>Tags</span> <span>{(entry.metadata.aiTags || []).join(", ") || 'NONE'}</span></div>
                        </div>
                        <div class="mt-4">
                            <SuperButton outline className="w-full" onclick={() => restoreVersion(entry)}>
                                Recover Snapshot
                            </SuperButton>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</Modal>

<style>
    .time-machine-view { padding: 1rem; }
    .tm-header { text-align: center; }
    .h-icon { background: var(--hover); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; border: 1px solid var(--border); }

    .history-list { display: flex; flex-direction: column; gap: 1rem; max-height: 400px; overflow-y: auto; padding-right: 10px; }
    .history-card { padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--border); }

    .card-meta { display: flex; justify-content: space-between; align-items: center; }
    .ts { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 800; color: var(--primary); }
    .action-tag { font-size: 0.6rem; font-weight: 900; background: var(--hover); padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }

    .card-details { display: flex; flex-direction: column; gap: 6px; }
    .d-row { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }
    .d-row span:last-child { color: var(--text); }

    .empty-tm { padding: 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .w-full { width: 100%; }
</style>
