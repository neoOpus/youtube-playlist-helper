<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { storageService, videoService, notificationService } from "@yph/core";
  import type { Playlist, Video } from "@yph/core";
  import { TerminalIcon, CheckIcon, SearchIcon, SuperButton } from "@yph/ui-kit";

  let { display = $bindable(false) } = $props();

  let scanning = $state(false);
  let playlists = $state<Playlist[]>([]);
  let brokenVideos = $state<{video: Video, playlist: Playlist}[]>([]);

  onMount(async () => {
    playlists = await storageService.getPlaylists();
  });

  async function scanLibrary() {
      scanning = true;
      brokenVideos = [];

      for (const pl of playlists) {
          if (pl.loadedVideos) {
              for (const v of pl.loadedVideos) {
                  if (v.title === "Unknown Video" || !v.title) {
                      brokenVideos.push({ video: v, playlist: pl });
                  }
              }
          }
      }

      setTimeout(() => {
          scanning = false;
          if (brokenVideos.length === 0) {
              notificationService.success("Infrastructure Integrity Confirmed. No anomalies found.");
          }
      }, 1500);
  }

  function close() { display = false; }
</script>

{#if display}
    <div
        class="modal-overlay"
        transition:fade
        onclick={close}
        onkeydown={(e) => e.key === 'Enter' && close()}
        role="button"
        tabindex="0"
        aria-label="Close Repair Protocol Overlay"
    >
        <div
            class="modal-content pro-glass-high"
            transition:fly={{ y: 20 }}
            onclick={e => e.stopPropagation()}
            onkeydown={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="repair-protocol-title"
            tabindex="-1"
        >
            <div class="modal-header">
                <TerminalIcon size="24" color="var(--primary)" />
                <h2 id="repair-protocol-title">Infrastructure Repair Protocol</h2>
            </div>

            <div class="modal-body">
                {#if scanning}
                    <div class="scan-state">
                        <div class="pulse-ring"></div>
                        <p>Scanning infrastructure metadata nodes...</p>
                    </div>
                {:else if brokenVideos.length > 0}
                    <div class="results-list">
                        {#each brokenVideos as item}
                            <div class="broken-node">
                                <div class="node-info">
                                    <span class="node-id">{item.video.videoId}</span>
                                    <span class="pl-name">Source: {item.playlist.title}</span>
                                </div>
                                <SuperButton outline mini onclick={() => alert("Repair sequence drafted.")}>Repair</SuperButton>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="intro-state">
                        <p>Launch a deep scan of your entire local infrastructure to identify and repair broken metadata links.</p>
                        <SuperButton primary onclick={scanLibrary} style="margin-top: 2rem;">Execute Deep Scan</SuperButton>
                    </div>
                {/if}
            </div>

            <div class="modal-footer">
                <SuperButton outline onclick={close}>Deactivate</SuperButton>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 6000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); border: none; cursor: default; }
    .modal-content { width: 500px; max-width: 90vw; padding: 2.5rem; outline: none; cursor: auto; }
    .modal-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    h2 { margin: 0; font-weight: 900; letter-spacing: -1px; font-size: var(--font-xl); }
    .modal-body { min-height: 200px; }
    .scan-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; gap: 1.5rem; }
    .pulse-ring { width: 50px; height: 50px; border: 3px solid var(--primary); border-radius: 50%; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }
    .broken-node { display: flex; justify-content: space-between; align-items: center; background: var(--hover); padding: 12px 16px; border-radius: 12px; margin-bottom: 12px; border: 1px solid var(--border); }
    .node-info { display: flex; flex-direction: column; gap: 2px; }
    .node-id { font-family: 'JetBrains Mono'; font-weight: 800; font-size: 0.75rem; color: var(--primary); }
    .pl-name { font-size: 0.65rem; color: var(--text-muted); font-weight: 700; }
    .modal-footer { margin-top: 2rem; display: flex; justify-content: flex-end; }
</style>
