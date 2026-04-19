<svelte:options runes={true} />
<script lang="ts">
  import { fade, fly, slide } from "svelte/transition";
  import {
      TerminalIcon,
      PlusMultiple,
      DeleteIcon,
      SuperButton,
      CheckIcon,
      InfoIcon,
      SearchIcon
  } from "@yph/ui-kit";
  import { storageService, notificationService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";

  let query = $state("");
  let processing = $state(false);
  let showConsole = $state(false);
  let logs = $state<string[]>([]);

  function log(msg: string) {
      logs = [msg, ...logs.slice(0, 19)];
  }

  async function executeBulk() {
      if (!query.trim()) return;
      processing = true;
      showConsole = true;
      log(`INITIATING BULK COMMAND: "${query}"`);

      try {
          const playlists = await storageService.getPlaylists();
          let modifiedCount = 0;
          const [command, ...args] = query.split(" ");

          for (const pl of playlists) {
              if (!pl.loadedVideos) continue;
              let plModified = false;

              for (let i = 0; i < pl.loadedVideos.length; i++) {
                  const video = pl.loadedVideos[i];
                  let target = false;

                  // Parse target (simplified for now: "tag:X", "rating:Y", "all")
                  if (query.includes("all")) target = true;
                  else if (query.includes("tag:") && (video.aiTags || []).some(t => query.includes(`tag:${t}`))) target = true;
                  else if (query.includes("rating:") && video.rating === parseInt(query.split("rating:")[1])) target = true;

                  if (target) {
                      if (query.includes("add-tag:")) {
                          const tag = query.split("add-tag:")[1].split(" ")[0];
                          if (!video.aiTags) video.aiTags = [];
                          if (!video.aiTags.includes(tag)) {
                              video.aiTags.push(tag);
                              plModified = true;
                              modifiedCount++;
                          }
                      } else if (query.includes("set-rating:")) {
                          const rating = parseInt(query.split("set-rating:")[1]);
                          if (video.rating !== rating) {
                              video.rating = rating;
                              plModified = true;
                              modifiedCount++;
                          }
                      }
                  }
              }

              if (plModified) {
                  await storageService.savePlaylist(pl);
              }
          }

          log(`SUCCESS: ${modifiedCount} nodes modulated.`);
          notificationService.success(`Bulk modulation complete: ${modifiedCount} nodes.`);
          query = "";
      } catch (err) {
          log(`ERROR: ${err.message}`);
          notificationService.error("Bulk modulation failed.");
      } finally {
          processing = false;
      }
  }
</script>

<div class="bulk-ops pro-glass mt-8" in:fade>
    <div class="ops-header">
        <TerminalIcon size="20" color="var(--primary)" />
        <div class="title-meta">
            <h3>Mass Maintenance & Modulation</h3>
            <p>Terminal-inspired query interface for bulk infrastructure modulation.</p>
        </div>
    </div>

    <div class="ops-body mt-6">
        <div class="query-box luminous-hover">
            <span class="prompt">></span>
            <input
                bind:value={query}
                placeholder="tag:Priority add-tag:Reviewed"
                class="query-input"
                onkeydown={e => e.key === 'Enter' && executeBulk()}
            />
            <button class="exec-btn" onclick={executeBulk} disabled={processing || !query}>
                {#if processing}
                    <TerminalIcon size="16" class="spin" />
                {:else}
                    <CheckIcon size="16" />
                {/if}
            </button>
        </div>

        <div class="hints mt-4">
            <div class="hint-item"><span class="cmd">all set-rating:5</span> Full infrastructure optimization</div>
            <div class="hint-item"><span class="cmd">tag:Old add-tag:Archive</span> Semantic state migration</div>
        </div>

        {#if showConsole}
            <div class="console mt-6" transition:slide>
                <div class="console-header">
                    <span>SYSTEM_LOG</span>
                    <button class="close-console" onclick={() => showConsole = false}>×</button>
                </div>
                <div class="console-body">
                    {#each logs as l}
                        <div class="log-line">> {l}</div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .bulk-ops { padding: var(--space-8); border: 1px solid var(--border); }
    .ops-header { display: flex; align-items: center; gap: 16px; }
    .title-meta h3 { margin: 0; font-size: var(--font-lg); font-weight: 800; color: var(--text); }
    .title-meta p { margin: 0; font-size: var(--font-xs); color: var(--text-muted); font-weight: 600; }

    .query-box {
        background: var(--bg-secondary);
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 4px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
    }
    .prompt { font-family: 'JetBrains Mono', monospace; font-weight: 900; color: var(--primary); font-size: 1.2rem; }
    .query-input {
        background: transparent;
        border: none;
        color: white;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        font-weight: 700;
        flex-grow: 1;
        padding: 12px 0;
        outline: none;
    }
    .exec-btn {
        background: var(--primary);
        color: white;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
    }
    .exec-btn:hover:not(:disabled) { transform: scale(1.1); }
    .exec-btn:disabled { opacity: 0.5; background: var(--text-dim); }

    .hints { display: flex; gap: 20px; }
    .hint-item { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 8px; }
    .cmd { font-family: 'JetBrains Mono', monospace; color: var(--primary); background: rgba(var(--primary-rgb), 0.1); padding: 2px 6px; border-radius: 4px; }

    .console { background: #0a0f19; border-radius: 12px; border: 1px solid var(--border-strong); overflow: hidden; }
    .console-header { background: #1a1f29; padding: 6px 16px; display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; font-weight: 900; color: var(--text-dim); border-bottom: 1px solid var(--border); }
    .close-console { background: transparent; border: none; color: var(--text-dim); cursor: pointer; font-size: 1rem; }
    .console-body { padding: 12px 16px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--success); display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow-y: auto; }
    .log-line { opacity: 0.9; }

    :global(.spin) { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
</style>
