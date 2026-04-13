<svelte:options runes={true} />
<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { TerminalIcon, PlusMultiple, DeleteIcon, SuperButton, SuperSelect, SuperInput } from "@yph/ui-kit";
  import type { Video } from "@yph/core";

  interface Rule {
    id: string;
    type: 'tag' | 'channel' | 'quality';
    value: string;
    action: 'keep' | 'remove';
  }

  let { videos = $bindable(), onapply }: { videos: Video[], onapply: (updated: Video[]) => void } = $props();

  let rules = $state<Rule[]>([]);
  let showAdd = $state(false);

  let newRuleType = $state<'tag' | 'channel' | 'quality'>('tag');
  let newRuleValue = $state('');
  let newRuleAction = $state<'keep' | 'remove'>('keep');

  function addRule() {
    if (!newRuleValue) return;
    rules.push({
        id: crypto.randomUUID(),
        type: newRuleType,
        value: newRuleValue,
        action: newRuleAction
    });
    newRuleValue = '';
    showAdd = false;
  }

  function removeRule(id: string) {
    rules = rules.filter(r => r.id !== id);
  }

  function applyRules() {
    let filtered = [...videos];
    rules.forEach(rule => {
        filtered = filtered.filter(v => {
            let match = false;
            if (rule.type === 'tag') match = (v.aiTags || []).includes(rule.value);
            if (rule.type === 'channel') match = v.channel === rule.value;
            if (rule.type === 'quality') match = (v.rating || 0) >= Number(rule.value);

            return rule.action === 'keep' ? match : !match;
        });
    });
    onapply(filtered);
  }

  const typeOptions = [
      { value: 'tag', label: 'By Tag' },
      { value: 'channel', label: 'By Channel' },
      { value: 'quality', label: 'Min Quality' }
  ];

  const actionOptions = [
      { value: 'keep', label: 'Must Include' },
      { value: 'remove', label: 'Must Exclude' }
  ];
</script>

<div class="smart-rules pro-glass mt-8">
    <div class="rules-header">
        <div class="title-group">
            <h3 class="card-title"><TerminalIcon size="18" /> Logic Engines</h3>
            <p class="muted">Automated sector organization rules.</p>
        </div>
        <button class="add-btn" onclick={() => showAdd = !showAdd}>
            <PlusMultiple size="16" />
        </button>
    </div>

    {#if showAdd}
        <div class="rule-form mt-4" transition:slide>
            <div class="form-grid">
                <SuperSelect options={typeOptions} bind:value={newRuleType} />
                <SuperInput bind:value={newRuleValue} placeholder="Identifier..." />
                <SuperSelect options={actionOptions} bind:value={newRuleAction} />
            </div>
            <div class="mt-4 row justify-end">
                <SuperButton outline onclick={() => showAdd = false}>Cancel</SuperButton>
                <SuperButton primary onclick={addRule} className="ml-2">Link Logic</SuperButton>
            </div>
        </div>
    {/if}

    <div class="rules-list mt-6">
        {#each rules as rule (rule.id)}
            <div class="rule-item" transition:fade>
                <div class="rule-meta">
                    <span class="r-action" class:remove={rule.action === 'remove'}>{rule.action === 'keep' ? 'ALLOW' : 'DROP'}</span>
                    <span class="r-type">{rule.type}</span>
                    <span class="r-val">{rule.value}</span>
                </div>
                <button class="icon-btn danger" onclick={() => removeRule(rule.id)}>
                    <DeleteIcon size="14" />
                </button>
            </div>
        {/each}

        {#if rules.length === 0}
            <p class="empty-msg muted">No active logic engines assigned to this node.</p>
        {/if}
    </div>

    {#if rules.length > 0}
        <div class="mt-6">
            <SuperButton onclick={applyRules} className="w-full">
                Synchronize Logic Grid
            </SuperButton>
        </div>
    {/if}
</div>

<style>
    .smart-rules { padding: var(--space-6); border-radius: var(--radius-2xl); }
    .rules-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .card-title { margin: 0; font-weight: 800; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
    .muted { margin: 0; font-size: 0.7rem; font-weight: 700; }

    .add-btn { background: var(--hover); border: 1px solid var(--border); color: var(--primary); padding: 8px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .add-btn:hover { background: var(--primary); color: white; transform: scale(1.1); }

    .form-grid { display: flex; flex-direction: column; gap: 10px; }

    .rules-list { display: flex; flex-direction: column; gap: 8px; }
    .rule-item { background: var(--hover); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }

    .rule-meta { display: flex; align-items: center; gap: 10px; }
    .r-action { font-size: 0.6rem; font-weight: 900; padding: 2px 6px; border-radius: 4px; background: rgba(0, 230, 118, 0.1); color: #00e676; }
    .r-action.remove { background: rgba(255, 82, 82, 0.1); color: #ff5252; }
    .r-type { font-size: 0.7rem; font-weight: 800; opacity: 0.5; text-transform: uppercase; }
    .r-val { font-size: 0.8rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; }

    .icon-btn { background: transparent; border: none; padding: 4px; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; }
    .icon-btn:hover { opacity: 1; }
    .icon-btn.danger:hover { color: var(--danger); }

    .empty-msg { font-size: 0.7rem; text-align: center; padding: 10px; }
    .w-full { width: 100%; }
    .row { display: flex; }
    .justify-end { justify-content: flex-end; }
</style>
