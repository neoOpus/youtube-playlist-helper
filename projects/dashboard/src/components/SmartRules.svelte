<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import {
      CheckIcon,
      TerminalIcon,
      PlusMultiple,
      DeleteIcon,
      SuperButton,
      InfoIcon
  } from "@yph/ui-kit";
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
      notificationService.success("Smart Rule Protocol established.");
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
      notificationService.info("Executing global maintenance protocols...");
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
              if (plModified) {
                  await storageService.savePlaylist(pl);
              }
          }
          notificationService.success(`Maintenance complete. ${modifiedCount} nodes optimized.`);
      } finally {
          executing = false;
      }
  }
</script>

<div class="smart-rules pro-glass mt-8" in:fade>
    <div class="rules-header">
        <div class="title-meta">
            <h3><TerminalIcon size="18" /> Smart Rules v2</h3>
            <p>Automate infrastructure maintenance using AI signals.</p>
        </div>
        <SuperButton outline mini onclick={() => showBuilder = !showBuilder}>
            {showBuilder ? 'Cancel' : 'New Rule'}
        </SuperButton>
    </div>

    {#if showBuilder}
        <div class="rule-builder mt-6" transition:slide>
            <div class="builder-row">
                <span class="label">Rule Designation</span>
                <input bind:value={newRule.name} placeholder="Rule Name" class="pro-input" />
            </div>

            <div class="logic-grid mt-4">
                <div class="logic-block">
                    <span class="label">Condition Field</span>
                    <select bind:value={newRule.condition.field} class="pro-select">
                        <option value="rating">Rating</option>
                        <option value="vibe">Vibe</option>
                        <option value="tag">Tag</option>
                        <option value="duration">Duration</option>
                    </select>
                </div>
                <div class="logic-block">
                    <span class="label">Operator</span>
                    <select bind:value={newRule.condition.operator} class="pro-select">
                        <option value="gt">Greater Than</option>
                        <option value="lt">Less Than</option>
                        <option value="eq">Equals</option>
                        <option value="contains">Contains</option>
                    </select>
                </div>
                <div class="logic-block">
                    <span class="label">Threshold Value</span>
                    <input bind:value={newRule.condition.value} class="pro-input" />
                </div>
            </div>

            <div class="action-block mt-4">
                <span class="label">Automated Action</span>
                <div class="action-row">
                    <select bind:value={newRule.action.type} class="pro-select">
                        <option value="tag">Add Tag</option>
                        <option value="rate">Set Rating</option>
                        <option value="decommission">Mark for Decommission</option>
                    </select>
                    {#if newRule.action.type === 'tag'}
                        <input bind:value={newRule.action.params.tag} placeholder="Tag" class="pro-input" />
                    {:else if newRule.action.type === 'rate'}
                        <input type="number" bind:value={newRule.action.params.rating} min="1" max="5" class="pro-input" />
                    {/if}
                </div>
            </div>

            <div class="builder-actions mt-6">
                <SuperButton primary fullWidth onclick={saveRule}>Commit Rule</SuperButton>
            </div>
        </div>
    {/if}

    <div class="rules-list mt-6">
        {#each rules as rule (rule.id)}
            <div class="rule-item luminous-hover" class:inactive={!rule.active}>
                <div class="rule-status">
                    <button class="status-toggle" onclick={() => toggleRule(rule)} aria-label="Toggle rule status">
                        <div class="status-indicator" class:active={rule.active}></div>
                    </button>
                    <span class="rule-name">{rule.name}</span>
                </div>
                <div class="rule-ops">
                    <button class="op-btn" onclick={() => deleteRule(rule.id)} title="Delete Rule"><DeleteIcon size="14" /></button>
                </div>
            </div>
        {:else}
            <div class="empty-rules">
                <InfoIcon size="24" />
                <p>No active maintenance rules found.</p>
            </div>
        {/each}
    </div>

    {#if rules.length > 0}
        <div class="maintenance-trigger mt-6">
            <SuperButton outline fullWidth onclick={executeRules} disabled={executing}>
                {#if executing}
                    <TerminalIcon size="16" class="spin" /> Executing Protocols...
                {:else}
                    <PlusMultiple size="16" /> Execute Maintenance
                {/if}
            </SuperButton>
        </div>
    {/if}
</div>

<style>
    .smart-rules { padding: var(--space-8); border: 1px solid var(--border); }
    .rules-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .title-meta h3 { margin: 0; font-size: var(--font-lg); font-weight: 800; display: flex; align-items: center; gap: 8px; }
    .title-meta p { margin: 0; font-size: var(--font-xs); color: var(--text-muted); font-weight: 600; }
    .rule-builder { background: var(--hover); padding: var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--border-strong); }
    .logic-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .logic-block, .action-block { display: flex; flex-direction: column; gap: 6px; }
    .label { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; color: var(--text-dim); }
    .pro-input, .pro-select { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; width: 100%; outline: none; }
    .pro-input:focus, .pro-select:focus { border-color: var(--primary); }
    .action-row { display: flex; gap: 12px; }
    .rule-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--bg-secondary); border-radius: 12px; margin-bottom: 8px; border: 1px solid var(--border); transition: opacity 0.3s; }
    .rule-item.inactive { opacity: 0.5; }
    .rule-status { display: flex; align-items: center; gap: 12px; }
    .status-toggle { background: transparent; border: none; padding: 0; cursor: pointer; display: flex; align-items: center; }
    .status-indicator { width: 10px; height: 10px; border-radius: 50%; background: var(--text-dim); transition: all 0.3s; }
    .status-indicator.active { background: var(--success); box-shadow: 0 0 10px var(--success); }
    .rule-name { font-weight: 800; font-size: 0.85rem; color: var(--text); }
    .op-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; transition: color 0.2s; }
    .op-btn:hover { color: var(--error); }
    .empty-rules { padding: 2rem; text-align: center; color: var(--text-dim); display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .empty-rules p { font-size: 0.75rem; font-weight: 700; margin: 0; }
    :global(.spin) { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
</style>
