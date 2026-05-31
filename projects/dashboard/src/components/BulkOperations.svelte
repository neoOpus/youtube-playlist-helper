<svelte:options runes={true} />
<script lang="ts">
  import {
    Terminal,
    Check,
    X,
    MessageSquare
  } from "lucide-svelte";
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
          for (const pl of playlists) {
              if (!pl.loadedVideos) continue;
              let plModified = false;
              for (const video of pl.loadedVideos) {
                  if (query.includes("all") || (video.aiTags || []).some(t => query.includes(`tag:${t}`))) {
                      if (query.includes("add-tag:")) {
                          const tag = query.split("add-tag:")[1].split(" ")[0];
                          if (!video.aiTags?.includes(tag)) {
                              video.aiTags = [...(video.aiTags || []), tag];
                              plModified = true;
                              modifiedCount++;
                          }
                      }
                  }
              }
              if (plModified) await storageService.savePlaylist(pl);
          }
          log(`SUCCESS: ${modifiedCount} nodes modulated.`);
          notificationService.success(`Bulk complete: ${modifiedCount} nodes.`);
          query = "";
      } catch (err: any) {
          log(`ERROR: ${err.message}`);
      } finally {
          processing = false;
      }
  }
</script>

<div class="bulk-ops surface-1 mt-8">
    <div class="header">
        <Terminal size="18" class="text-primary" />
        <div class="info">
            <h3>Mass Modulation</h3>
            <p class="text-secondary">Terminal interface for bulk infrastructure operations.</p>
        </div>
    </div>

    <div class="body mt-6">
        <div class="input-row surface-2">
            <span class="prompt">></span>
            <input
                bind:value={query}
                placeholder="all add-tag:Reviewed"
                onkeydown={e => e.key === 'Enter' && executeBulk()}
            />
            <button class="exec-btn" onclick={executeBulk} disabled={processing || !query}>
                <Check size="16" />
            </button>
        </div>

        {#if showConsole}
            <div class="console mt-4">
                <div class="console-header">
                    <span>SYSTEM_LOG</span>
                    <button onclick={() => showConsole = false}><X size="14" /></button>
                </div>
                <div class="console-body">
                    {#each logs as l}
                        <div class="line">> {l}</div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .bulk-ops { padding: 24px; border: 1px solid var(--border-base); }
    .header { display: flex; align-items: center; gap: 16px; }
    h3 { font-size: 1.1rem; font-weight: 700; margin: 0; }
    p { font-size: 0.8rem; margin: 0; }

    .input-row { display: flex; align-items: center; padding: 4px 16px; border-radius: 8px; border: 1px solid var(--border-strong); }
    .prompt { font-family: monospace; font-weight: 900; color: var(--primary); margin-right: 12px; }
    input { flex: 1; background: transparent; border: none; padding: 12px 0; color: var(--text-main); font-family: monospace; font-weight: 600; outline: none; }

    .exec-btn { background: var(--primary); color: white; border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .exec-btn:disabled { opacity: 0.5; }

    .console { background: var(--bg-app); border-radius: 8px; border: 1px solid var(--border-strong); overflow: hidden; }
    .console-header { background: var(--bg-surface-2); padding: 4px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.6rem; font-weight: 800; color: var(--text-muted); }
    .console-header button { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
    .console-body { padding: 8px 12px; font-family: monospace; font-size: 0.75rem; color: var(--secondary); max-height: 150px; overflow-y: auto; }

    .mt-8 { margin-top: 2rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-4 { margin-top: 1rem; }
</style>
