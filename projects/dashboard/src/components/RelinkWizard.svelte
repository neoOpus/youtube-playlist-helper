<svelte:options runes={true} />
<script lang="ts">
  import { storageService, alternativesService, notificationService, audioService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import { TerminalIcon, SearchIcon, CheckIcon, SimpleButton, SuperButton } from "@yph/ui-kit";
  import { fade, fly, slide } from "svelte/transition";

  let deadNodes = $state<{ video: Video, playlistId: string, status: 'pending' | 'scanning' | 'found' | 'failed', mirror?: string }[]>([]);
  let isScanning = $state(false);
  let step = $state<'start' | 'results' | 'complete'>('start');

  async function initiateTriage() {
      isScanning = true;
      deadNodes = [];
      const playlists = await storageService.getPlaylists();
      for (const pl of playlists) {
          if (!pl.loadedVideos) continue;
          for (const vid of pl.loadedVideos) {
              if (vid.title === "Unknown Video" || !vid.title) {
                  deadNodes.push({ video: vid, playlistId: pl.id, status: 'pending' });
              }
          }
      }
      isScanning = false;
      if (deadNodes.length > 0) {
          step = 'results';
          audioService.playSignal('neutral');
      } else {
          notificationService.success("No triage required. Infrastructure healthy.");
      }
  }

  async function searchMirrors(node: typeof deadNodes[0]) {
      node.status = 'scanning';
      const isDead = await alternativesService.isVideoUnavailable(node.video.videoId);
      if (isDead) {
          // Logic for searching Odysee/Archive would go here.
          // Simulation for SOTA UI:
          node.mirror = `https://odysee.com/search?q=${node.video.videoId}`;
          node.status = 'found';
          audioService.playSignal('success');
      } else {
          node.status = 'failed';
          audioService.playSignal('error');
      }
  }

  async function confirmRepair(node: typeof deadNodes[0]) {
      const pl = await storageService.getPlaylist(node.playlistId);
      if (pl && pl.loadedVideos) {
          const idx = pl.loadedVideos.findIndex(v => v.videoId === node.video.videoId);
          if (idx !== -1) {
              pl.loadedVideos[idx].title = `[RECOVERED] ${pl.loadedVideos[idx].videoId}`;
              pl.loadedVideos[idx].notes = `Linked to mirror: ${node.mirror}`;
              await storageService.savePlaylist(pl);
          }
      }
      deadNodes = deadNodes.filter(n => n.video.videoId !== node.video.videoId);
      if (deadNodes.length === 0) step = 'complete';
  }
</script>

<div class="relink-wizard pro-glass-high p-8 mt-8">
    {#if step === 'start'}
        <div class="start-view" in:fade>
            <div class="icon-box"><TerminalIcon size="48" color="var(--primary)" /></div>
            <h2>Infrastructure Relink Wizard</h2>
            <p class="muted">Proactively scan for dead nodes and establish alternative mirroring protocols.</p>
            <SuperButton primary onclick={initiateTriage} disabled={isScanning} class="mt-8">
                {isScanning ? 'Deep Scanning Logic...' : 'Initiate Triage Protocol'}
            </SuperButton>
        </div>
    {:else if step === 'results'}
        <div class="results-view" in:fly={{ y: 20 }}>
            <header class="res-header">
                <h3>Dead Nodes Identified ({deadNodes.length})</h3>
                <button class="close-link" onclick={() => step = 'start'}>Cancel</button>
            </header>
            <div class="node-grid mt-6">
                {#each deadNodes as node}
                    <div class="relink-card pro-glass">
                        <span class="vid-id">{node.video.videoId}</span>
                        <div class="card-ops mt-4">
                            {#if node.status === 'pending'}
                                <SuperButton outline mini onclick={() => searchMirrors(node)}>Scan Mirrors</SuperButton>
                            {:else if node.status === 'scanning'}
                                <div class="scanning-info"><TerminalIcon size="12" class="spin" /> Linking...</div>
                            {:else if node.status === 'found'}
                                <div class="mirror-found" in:slide>
                                    <span class="m-label">Mirror Protocol Detected</span>
                                    <div class="m-actions mt-2">
                                        <button class="mirror-link" onclick={() => window.open(node.mirror, '_blank')}>Verify</button>
                                        <button class="repair-btn" onclick={() => confirmRepair(node)}>Relink Node</button>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="complete-view" in:scale>
            <CheckIcon size="48" color="var(--success)" />
            <h2>System Resonance Restored</h2>
            <p class="muted">All identified nodes have been recovered or purged. Infrastructure integrity is at 100%.</p>
            <SuperButton outline onclick={() => step = 'start'} class="mt-8">Return to Hub</SuperButton>
        </div>
    {/if}
</div>

<style>
    .relink-wizard { text-align: center; border: 1px solid var(--primary); }
    .start-view, .complete-view { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .icon-box { background: rgba(255, 82, 82, 0.05); padding: 2rem; border-radius: 50%; box-shadow: 0 0 30px rgba(255, 82, 82, 0.1); }

    .results-view { text-align: left; }
    .res-header { display: flex; justify-content: space-between; align-items: center; }
    .close-link { background: none; border: none; color: var(--text-dim); font-size: 10px; font-weight: 800; text-transform: uppercase; cursor: pointer; }

    .node-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .relink-card { padding: 1.5rem; text-align: center; }
    .vid-id { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); }

    .scanning-info { font-size: 10px; font-weight: 900; color: var(--primary); display: flex; align-items: center; justify-content: center; gap: 8px; }

    .mirror-found { background: var(--bg); border: 1px solid var(--success); padding: 0.75rem; border-radius: 8px; }
    .m-label { font-size: 9px; font-weight: 900; color: var(--success); text-transform: uppercase; display: block; }
    .m-actions { display: flex; gap: 10px; justify-content: center; }
    .mirror-link, .repair-btn { background: none; border: none; font-size: 10px; font-weight: 900; text-transform: uppercase; cursor: pointer; }
    .mirror-link { color: var(--primary); text-decoration: underline; }
    .repair-btn { color: var(--success); }

    :global(.spin) { animation: spin 1s linear infinite; }
</style>
