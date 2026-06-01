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
      CheckCircle2,
      Cpu
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
            <h3><Cpu size="16" class="text-primary" /> Smart Rules v2</h3>
            <p class="text-secondary">Automate infrastructure maintenance using AI signals and metadata.</p>
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
                    <span class="label">Signal Field</span>
                    <select bind:value={newRule.condition.field}>
                        <option value="rating">Rating</option>
                        <option value="vibe">Vibe</option>
                        <option value="tag">Tag</option>
                        <option value="title">Title</option>
                        <option value="summary">AI Summary</option>
                        <option value="duration">Duration</option>
                    </select>
                </div>
                <div class="logic-block">
                    <span class="label">Operator</span>
                    <select bind:value={newRule.condition.operator}>
                        <option value="gt">Greater Than</option>
                        <option value="lt">Less Than</option>
                        <option value="eq">Equals</option>
                        <option value="contains">Contains</option>
                    </select>
                </div>
                <div class="logic-block">
                    <span class="label">Match Value</span>
                    <input bind:value={newRule.condition.value} placeholder="Value" />
                </div>
            </div>

            <div class="action-block mt-6">
                <SuperButton primary fullWidth onclick={saveRule}>Commit Rule to Registry</SuperButton>
            </div>
        </div>
    {/if}

    <div class="rules-list mt-6">
        {#each rules as rule (rule.id)}
            <div class="rule-item surface-2" class:inactive={!rule.active}>
                <div class="rule-status">
                    <button class="toggle" onclick={() => toggleRule(rule)} aria-label="Toggle Rule Active State">
                        <div class="dot" class:active={rule.active}></div>
                    </button>
                    <div class="rule-info">
                        <span class="rule-name">{rule.name}</span>
                        <span class="rule-summary muted">{rule.condition.field} {rule.condition.operator} {rule.condition.value}</span>
                    </div>
                </div>
                <button class="delete-btn" onclick={() => deleteRule(rule.id)} title="Delete Rule"><Trash2 size="14" /></button>
            </div>
        {:else}
            <div class="empty">
                <Info size="24" class="text-dim" />
                <p>No active rules detected in registry.</p>
            </div>
        {/each}
    </div>

    {#if rules.length > 0}
        <div class="mt-6">
            <button class="exec-btn" onclick={executeRules} disabled={executing}>
                <Play size="14" />
                <span>{executing ? 'Processing Registry...' : 'Execute Rule Engine'}</span>
            </button>
        </div>
    {/if}
</div>

<style>
    .smart-rules { padding: 24px; border: 1px solid var(--border-base); border-radius: 12px; }
    .rules-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .title-meta h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
    .title-meta p { font-size: 0.8rem; margin: 0; }

    .add-btn { background: var(--bg-surface-2); border: 1px solid var(--border-strong); color: var(--text-main); padding: 6px 16px; border-radius: 8px; font-weight: 700; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
    .add-btn:hover { border-color: var(--primary); color: var(--primary); }

    .rule-builder { padding: 20px; background: var(--bg-surface-2); border-radius: 10px; border: 1px solid var(--border-strong); }
    .logic-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .logic-block { display: flex; flex-direction: column; gap: 6px; }
    .label { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: var(--text-dim); letter-spacing: 0.05em; }

    input, select { background: var(--bg-app); border: 1px solid var(--border-base); color: var(--text-main); padding: 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; width: 100%; outline: none; transition: border-color 0.2s; }
    input:focus, select:focus { border-color: var(--primary); }

    .rule-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-base); margin-bottom: 10px; transition: opacity 0.2s; }
    .rule-item.inactive { opacity: 0.6; }
    .rule-status { display: flex; align-items: center; gap: 16px; }
    .toggle { background: transparent; border: none; padding: 0; cursor: pointer; display: flex; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--text-dim); transition: all 0.2s; }
    .dot.active { background: var(--success); box-shadow: 0 0 8px var(--success); }

    .rule-info { display: flex; flex-direction: column; gap: 2px; }
    .rule-name { font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
    .rule-summary { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }

    .delete-btn { background: transparent; border: none; color: var(--text-dim); cursor: pointer; transition: color 0.2s; }
    .delete-btn:hover { color: var(--danger); }

    .empty { padding: 40px; text-align: center; color: var(--text-dim); display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .empty p { font-size: 0.85rem; font-weight: 600; margin: 0; }

    .exec-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; background: var(--bg-surface-2); border: 1px solid var(--primary); color: var(--primary); padding: 12px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .exec-btn:hover:not(:disabled) { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
    .exec-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .mt-8 { margin-top: 2rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-4 { margin-top: 1rem; }
</style>
