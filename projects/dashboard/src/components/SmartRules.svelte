<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import {
      Terminal,
      Plus,
      Trash2,
      Info,
      Play,
      CheckCircle2
  } from "lucide-svelte";
  import { SuperButton } from "@yph/ui-kit";
  import { storageService, playlistService, notificationService } from "@yph/core";
  import type { SmartRule, Playlist } from "@yph/core";

  let rules = $state<SmartRule[]>([]);
  let showBuilder = $state(false);
  let playlists = $state<Playlist[]>([]);
  let executing = $state(false);

  let newRule = $state<SmartRule>({
      id: "",
      name: "New Intelligent Rule",
      active: true,
      condition: { field: 'rating', operator: 'gt', value: 4 },
      action: { type: 'tag', params: { tag: 'Priority' } }
  });

  onMount(async () => {
      const stored = await storageService.getSettings();
      rules = stored.smartRules || [];
      playlists = await storageService.getPlaylists();
  });

  async function saveRule() {
      const rule = { ...newRule, id: crypto.randomUUID() };
      rules = [...rules, rule];
      await storageService.updateSettings({ smartRules: rules });
      showBuilder = false;
      notificationService.success("Smart Rule established.");
      resetNewRule();
  }

  function resetNewRule() {
      newRule = {
          id: "",
          name: "New Intelligent Rule",
          active: true,
          condition: { field: 'rating', operator: 'gt', value: 4 },
          action: { type: 'tag', params: { tag: 'Priority' } }
      };
  }

  async function deleteRule(id: string) {
      rules = rules.filter(r => r.id !== id);
      await storageService.updateSettings({ smartRules: rules });
  }

  async function toggleRule(rule: SmartRule) {
      rule.active = !rule.active;
      rules = [...rules];
      await storageService.updateSettings({ smartRules: rules });
  }

  async function executeRules() {
      executing = true;
      notificationService.info("Executing maintenance protocols...");
      let modifiedCount = 0;

      try {
          for (const pl of playlists) {
              if (!pl.loadedVideos) continue;
              let plModified = false;
              for (const vid of pl.loadedVideos) {
                  for (const rule of rules) {
                      if (rule.active && playlistService.evaluateRule(vid, rule)) {
                          if (playlistService.applyAction(vid, rule)) {
                              plModified = true;
                              modifiedCount++;
                          }
                      }
                  }
              }
              if (plModified) await storageService.savePlaylist(pl);
          }
          notificationService.success(`Maintenance complete: ${modifiedCount} nodes.`);
      } finally {
          executing = false;
      }
  }
</script>

<div class="smart-rules surface-1 mt-8">
    <div class="rules-header">
        <div class="title-meta">
            <h3>Smart Rules</h3>
            <p class="text-secondary">Automate infrastructure maintenance using AI signals.</p>
        </div>
        <button class="add-btn" onclick={() => showBuilder = !showBuilder}>
            {showBuilder ? 'Cancel' : 'New Rule'}
        </button>
    </div>

    {#if showBuilder}
        <div class="rule-builder mt-6" transition:slide>
            <div class="field">
                <span class="label">Rule Designation</span>
                <input bind:value={newRule.name} placeholder="Rule Name" />
            </div>

            <div class="logic-grid mt-4">
                <div class="logic-block">
                    <span class="label">Field</span>
                    <select bind:value={newRule.condition.field}>
                        <option value="rating">Rating</option>
                        <option value="vibe">Vibe</option>
                        <option value="tag">Tag</option>
                    </select>
                </div>
                <div class="logic-block">
                    <span class="label">Op</span>
                    <select bind:value={newRule.condition.operator}>
                        <option value="gt">></option>
                        <option value="lt"><</option>
                        <option value="eq">=</option>
                    </select>
                </div>
                <div class="logic-block">
                    <span class="label">Value</span>
                    <input bind:value={newRule.condition.value} />
                </div>
            </div>

            <div class="action-block mt-6">
                <SuperButton primary fullWidth onclick={saveRule}>Commit Rule</SuperButton>
            </div>
        </div>
    {/if}

    <div class="rules-list mt-6">
        {#each rules as rule (rule.id)}
            <div class="rule-item surface-2" class:inactive={!rule.active}>
                <div class="rule-status">
                    <button class="toggle" onclick={() => toggleRule(rule)}>
                        <div class="dot" class:active={rule.active}></div>
                    </button>
                    <span class="rule-name">{rule.name}</span>
                </div>
                <button class="delete-btn" onclick={() => deleteRule(rule.id)}><Trash2 size="14" /></button>
            </div>
        {:else}
            <div class="empty">
                <Info size="24" class="text-muted" />
                <p>No active rules detected.</p>
            </div>
        {/each}
    </div>

    {#if rules.length > 0}
        <div class="mt-6">
            <button class="exec-btn" onclick={executeRules} disabled={executing}>
                <Play size="14" />
                <span>{executing ? 'Executing...' : 'Run Maintenance'}</span>
            </button>
        </div>
    {/if}
</div>

<style>
    .smart-rules { padding: 24px; border: 1px solid var(--border-base); }
    .rules-header { display: flex; justify-content: space-between; align-items: flex-start; }
    h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
    p { font-size: 0.8rem; margin: 0; }

    .add-btn { background: var(--bg-surface-2); border: 1px solid var(--border-strong); color: var(--text-main); padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer; }

    .rule-builder { padding: 16px; background: var(--bg-surface-2); border-radius: 8px; border: 1px solid var(--border-strong); }
    .logic-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .logic-block { display: flex; flex-direction: column; gap: 4px; }
    .label { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); }

    input, select { background: var(--bg-app); border: 1px solid var(--border-base); color: var(--text-main); padding: 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; width: 100%; outline: none; }
    input:focus, select:focus { border-color: var(--primary); }

    .rule-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: 8px; border: 1px solid var(--border-base); margin-bottom: 8px; }
    .rule-status { display: flex; align-items: center; gap: 12px; }
    .toggle { background: transparent; border: none; padding: 0; cursor: pointer; display: flex; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--text-dim); transition: all 0.2s; }
    .dot.active { background: var(--success); }
    .rule-name { font-weight: 700; font-size: 0.85rem; }

    .delete-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
    .delete-btn:hover { color: var(--danger); }

    .empty { padding: 32px; text-align: center; color: var(--text-dim); display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .empty p { font-size: 0.8rem; font-weight: 600; margin: 0; }

    .exec-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: var(--bg-surface-2); border: 1px solid var(--primary); color: var(--primary); padding: 10px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
    .exec-btn:hover:not(:disabled) { background: var(--primary); color: white; }
    .exec-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .mt-8 { margin-top: 2rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-4 { margin-top: 1rem; }
</style>
