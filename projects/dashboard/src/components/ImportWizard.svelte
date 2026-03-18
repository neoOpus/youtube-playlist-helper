<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import {
    CheckIcon,
    CloseIcon,
    PlusMultiple,
    SaveIcon,
    TagManager,
    InfoIcon
  } from "@yph/ui-kit";
  import { storageService, videoService, notificationService, actionLogger } from "@yph/core";
  import type { Playlist } from "@yph/core";

  const dispatch = createEventDispatcher();

  export let display = false;

  let step = 1;
  let importType: 'json' | 'urls' = 'json';
  let rawInput = "";

  let parsedPlaylists: Playlist[] = [];

  let targetPlaylistId = "new";
  let targetGroups: string[] = [];
  let conflictStrategy: 'skip' | 'overwrite' | 'merge' = 'skip';

  let existingPlaylists: Playlist[] = [];
  let processing = false;

  onMount(async () => {
      existingPlaylists = await storageService.getPlaylists();
  });

  async function handleFileChange(e: any) {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      rawInput = text;
      importType = 'json';
      nextStep();
  }

  function nextStep() {
      if (step === 1) {
          try {
              if (importType === 'json') {
                  const data = JSON.parse(rawInput);
                  parsedPlaylists = Array.isArray(data) ? data : [data];
                  if (!parsedPlaylists.every(p => p.title && Array.isArray(p.videos))) {
                      throw new Error("Invalid JSON format.");
                  }
              } else {
                  const parsedVideos = videoService.parseYoutubeIds(rawInput);
                  if (parsedVideos.length === 0) throw new Error("No valid IDs found.");
                  parsedPlaylists = [{
                      id: 'temp',
                      title: 'Imported Selection',
                      videos: parsedVideos,
                      timestamp: Date.now(),
                      groups: []
                  }];
              }
              step = 2;
          } catch (err: any) {
              notificationService.error(err.message || "Failed to parse.");
          }
      } else if (step === 2) {
          step = 3;
      }
  }

  async function runImport() {
      processing = true;
      try {
          const previousState = await storageService.getPlaylists();
          actionLogger.log("Mass Import", async () => {
              const current = await storageService.getPlaylists();
              for (const p of current) await storageService.removePlaylist(p);
              for (const p of previousState) await storageService.savePlaylist(p);
          });

          for (const p of parsedPlaylists) {
              let finalPlaylist: Playlist;

              if (targetPlaylistId === "new") {
                  finalPlaylist = { ...p, id: undefined, groups: [...new Set([...(p.groups || []), ...targetGroups])] };
              } else {
                  const existing = await storageService.getPlaylist(targetPlaylistId);
                  if (existing) {
                      const newVideos = conflictStrategy === 'skip'
                          ? p.videos.filter(v => !existing.videos.includes(v))
                          : p.videos;

                      finalPlaylist = {
                          ...existing,
                          videos: [...new Set([...existing.videos, ...newVideos])],
                          groups: [...new Set([...(existing.groups || []), ...targetGroups])]
                      };
                  } else {
                      finalPlaylist = { ...p, id: undefined, groups: targetGroups };
                  }
              }

              await storageService.savePlaylist(finalPlaylist);
          }

          notificationService.success(`Imported ${parsedPlaylists.length} playlists.`);
          dispatch("complete");
          close();
      } catch (err: any) {
          notificationService.error("Import failed: " + err.message);
      } finally {
          processing = false;
      }
  }

  function close() {
      display = false;
      step = 1;
      rawInput = "";
      parsedPlaylists = [];
  }
</script>

{#if display}
<div
    class="wizard-overlay"
    transition:fade
    role="button"
    tabindex="0"
    on:click={close}
    on:keydown={(e) => e.key === 'Escape' && close()}
    aria-label="Close import wizard"
>
    <div
        class="wizard-container pro-glass"
        in:fly={{ y: 50 }}
        on:click|stopPropagation
        on:keydown|stopPropagation
        role="dialog"
        aria-modal="true"
        aria-label="Import Wizard"
        tabindex="-1"
    >
        <div class="wizard-header">
            <div class="steps">
                <span class:active={step >= 1}>1. Source</span>
                <span class:active={step >= 2}>2. Logic</span>
                <span class:active={step >= 3}>3. Preview</span>
            </div>
            <button class="close-btn" on:click={close} aria-label="Close"><CloseIcon size="20" /></button>
        </div>

        <div class="wizard-content">
            {#if step === 1}
                <div class="step-pane" in:fade>
                    <h3>Select Import Source</h3>
                    <div class="import-options">
                        <button class="opt-card" class:selected={importType === 'json'} on:click={() => importType = 'json'}>
                            <SaveIcon size="32" />
                            <span>JSON SNAPSHOT</span>
                        </button>
                        <button class="opt-card" class:selected={importType === 'urls'} on:click={() => importType = 'urls'}>
                            <PlusMultiple size="32" />
                            <span>URL / ID LIST</span>
                        </button>
                    </div>

                    {#if importType === 'json'}
                        <div class="upload-zone">
                            <input type="file" accept=".json" on:change={handleFileChange} id="file-upload" />
                            <label for="file-upload">
                                <PlusMultiple size="24" />
                                <span>Click to upload infrastructure snapshot</span>
                            </label>
                        </div>
                    {:else}
                        <div class="field">
                            <label for="url-input">Neural Nodes (URLs/IDs)</label>
                            <textarea id="url-input" bind:value={rawInput} placeholder="Paste YouTube URLs or IDs here..."></textarea>
                        </div>
                    {/if}
                </div>

            {:else if step === 2}
                <div class="step-pane" in:fade>
                    <h3>Import Logic Configuration</h3>
                    <div class="config-form">
                        <div class="field">
                            <label for="target-pl">Target Infrastructure</label>
                            <select id="target-pl" bind:value={targetPlaylistId}>
                                <option value="new">Generate New Collections</option>
                                {#each existingPlaylists as pl}
                                    <option value={pl.id}>Merge with: {pl.title}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="field">
                            <label for="import-groups">Global Tags (Optional)</label>
                            <TagManager tags={targetGroups} on:change={(e) => targetGroups = e.detail} />
                        </div>

                        <fieldset class="field">
                            <legend class="section-label">Conflict Resolution</legend>
                            <div class="radio-group">
                                <label class="radio-item">
                                    <input type="radio" bind:group={conflictStrategy} value="skip" />
                                    <span>De-duplicate (Safe)</span>
                                </label>
                                <label class="radio-item">
                                    <input type="radio" bind:group={conflictStrategy} value="merge" />
                                    <span>Merge All (Additive)</span>
                                </label>
                                <label class="radio-item">
                                    <input type="radio" bind:group={conflictStrategy} value="overwrite" />
                                    <span>Overwrite Metadata</span>
                                </label>
                            </div>
                        </fieldset>
                    </div>
                </div>

            {:else if step === 3}
                <div class="step-pane" in:fade>
                    <h3>Ready for Integration</h3>
                    <div class="preview-list">
                        <div class="preview-summary">
                            <InfoIcon size="16" color="var(--primary)" />
                            <span>About to integrate <strong>{parsedPlaylists.length}</strong> collections containing <strong>{parsedPlaylists.reduce((a, b) => a + (b.videos?.length || 0), 0)}</strong> nodes.</span>
                        </div>
                        <div class="scroll-area">
                            {#each parsedPlaylists as pl}
                                <div class="preview-item">
                                    <span class="pl-title">{pl.title}</span>
                                    <span class="pl-meta">{pl.videos?.length || 0} nodes</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <div class="wizard-footer">
            {#if step > 1}
                <button class="btn secondary" on:click={() => step--} disabled={processing}>Back</button>
            {/if}
            <div class="spacer"></div>
            {#if step < 3}
                <button class="btn primary" on:click={nextStep} disabled={!rawInput && importType === 'urls'}>Continue</button>
            {:else}
                <button class="btn primary sota-glow" on:click={runImport} disabled={processing}>
                    {processing ? 'Processing...' : 'Synchronize'}
                </button>
            {/if}
        </div>
    </div>
</div>
{/if}

<style>
    .wizard-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
    .wizard-container { width: 620px; max-width: 95vw; max-height: 85vh; display: flex; flex-direction: column; cursor: default; }
    .wizard-header { padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .steps { display: flex; gap: 1.5rem; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; }
    .steps span.active { color: var(--primary); border-bottom: 2px solid var(--primary); }
    .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
    .wizard-content { padding: 2rem; flex-grow: 1; overflow-y: auto; }
    h3 { margin-bottom: 1.5rem; font-weight: 900; letter-spacing: -1px; }
    .import-options { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
    .opt-card { background: var(--hover); border: 2px solid transparent; border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; transition: all 0.2s; color: var(--text); width: 100%; }
    .opt-card:hover { transform: translateY(-4px); border-color: var(--border); }
    .opt-card.selected { background: var(--card-bg); border-color: var(--primary); box-shadow: 0 8px 24px var(--shadow); }
    .opt-card span { font-weight: 800; font-size: 0.8rem; letter-spacing: 1px; }
    .upload-zone { border: 2px dashed var(--border); border-radius: 16px; padding: 3rem; text-align: center; transition: all 0.2s; cursor: pointer; }
    .upload-zone:hover { border-color: var(--primary); background: var(--hover); }
    .upload-zone input { display: none; }
    .upload-zone label { display: flex; flex-direction: column; align-items: center; gap: 1rem; cursor: pointer; color: var(--text-muted); font-weight: 700; }
    textarea { width: 100%; height: 200px; background: var(--hover); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; color: var(--text); font-family: 'JetBrains Mono'; resize: none; outline: none; }
    .field { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 10px; border: none; padding: 0; }
    .section-label, .field label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
    select { background: var(--hover); border: 1px solid var(--border); color: var(--text); padding: 12px; border-radius: 10px; font-weight: 700; outline: none; width: 100%; }
    .radio-group { display: flex; flex-direction: column; gap: 10px; }
    .radio-item { display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 12px; border-radius: 12px; transition: background 0.2s; background: var(--hover); }
    .radio-item:hover { background: rgba(255, 255, 255, 0.08); }
    .radio-item input { width: 18px; height: 18px; accent-color: var(--primary); }
    .radio-item span { font-weight: 700; font-size: 0.9rem; }
    .preview-summary { background: var(--hover); padding: 1rem; border-radius: 12px; display: flex; gap: 12px; align-items: center; margin-bottom: 1.5rem; font-size: 0.85rem; border-left: 4px solid var(--primary); }
    .scroll-area { max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
    .preview-item { background: var(--card-bg); border: 1px solid var(--border); padding: 14px 18px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
    .pl-title { font-weight: 800; font-size: 0.95rem; }
    .pl-meta { font-size: 0.7rem; color: var(--text-muted); font-weight: 900; font-family: 'JetBrains Mono'; }
    .wizard-footer { padding: 1.5rem; border-top: 1px solid var(--border); display: flex; align-items: center; }
    .spacer { flex-grow: 1; }
    .btn { padding: 14px 28px; border-radius: 12px; font-weight: 800; cursor: pointer; border: 1px solid var(--border); transition: all 0.2s; color: var(--text); }
    .btn.primary { background: var(--primary); color: white; border-color: var(--primary); }
    .btn.secondary { background: var(--hover); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .sota-glow { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3); }
    @media (max-width: 500px) { .import-options { grid-template-columns: 1fr; } }
</style>
