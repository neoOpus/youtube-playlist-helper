<script lang="ts">
  import { db, type FormEntry } from '../lib/db';
  import { maskPII } from '../lib/pii';

  let { fieldId, onRestore } = $props();
  let entries = $state<FormEntry[]>([]);
  let historyIndex = $state(0);
  let showTimeMachine = $state(false);

  $effect(() => {
    db.entries.where({ domain: window.location.hostname, fieldId }).reverse().sortBy('timestamp').then(res => {
      entries = res;
    });
  });

  const currentEntry = $derived(entries[historyIndex]);
</script>

<div class="phoenix-shell">
  <div class="glass-menu">
    <div class="header">
      <div class="brand">
        <span class="p">P</span>HOENIX
      </div>
      <button class="toggle-btn" onclick={() => showTimeMachine = !showTimeMachine}>
        {showTimeMachine ? 'View List' : 'Time Machine'}
      </button>
    </div>

    {#if entries.length === 0}
      <div class="empty-state">No recovery path found</div>
    {:else if showTimeMachine}
      <div class="time-machine fade-in">
        <div class="preview-box">
          <pre>{maskPII(currentEntry?.value || '')}</pre>
        </div>
        <div class="tm-controls">
          <input type="range" min="0" max={entries.length - 1} bind:value={historyIndex} />
          <div class="meta">
            <span class="time">{new Date(currentEntry?.timestamp || 0).toLocaleTimeString()}</span>
            <span class="ver">v{currentEntry?.version}</span>
          </div>
          <button class="restore-action" onclick={() => onRestore(currentEntry.value)}>
            Restore Snapshot
          </button>
        </div>
      </div>
    {:else}
      <ul class="entry-list fade-in">
        {#each entries.slice(0, 8) as entry}
          <li onclick={() => onRestore(entry.value)}>
            <div class="entry-content">
              <span class="val">{maskPII(entry.value.slice(0, 70))}</span>
              <span class="sub">{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
          </li>
        {/each}
      </ul>
    {/if}

    <div class="footer">
       (c) 2026 neoOpus
    </div>
  </div>
</div>

<style>
  :host { all: initial; }
  .phoenix-shell {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: #fff;
    pointer-events: auto;
  }
  .glass-menu {
    background: rgba(18, 18, 20, 0.85);
    backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
    border-radius: 20px;
    width: 360px;
    padding: 16px;
    overflow: hidden;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .brand {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.2em;
    color: #888;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .brand .p { color: #00ff88; text-shadow: 0 0 8px rgba(0,255,136,0.4); }
  .toggle-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #ccc;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 11px;
    cursor: pointer;
    transition: 0.2s;
  }
  .toggle-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

  .entry-list { list-style: none; padding: 0; margin: 0; }
  li {
    background: rgba(255,255,255,0.02);
    border-radius: 14px;
    margin-bottom: 8px;
    padding: 14px;
    cursor: pointer;
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid transparent;
  }
  li:hover {
    background: rgba(255,255,255,0.06);
    transform: scale(1.02);
    border-color: rgba(0,255,136,0.2);
  }
  .val { font-size: 13px; line-height: 1.5; color: #ddd; display: block; word-break: break-word; }
  .sub { font-size: 10px; color: #555; margin-top: 8px; display: block; font-variant-numeric: tabular-nums; }

  .time-machine { display: flex; flex-direction: column; gap: 16px; }
  .preview-box {
    background: rgba(0,0,0,0.3);
    border-radius: 12px;
    padding: 16px;
    height: 140px;
    overflow-y: auto;
    border: 1px solid rgba(255,255,255,0.05);
  }
  pre { margin: 0; font-size: 12px; color: #00ff88; font-family: 'JetBrains Mono', monospace; white-space: pre-wrap; }
  .tm-controls { display: flex; flex-direction: column; gap: 12px; }
  input[type="range"] { width: 100%; accent-color: #00ff88; cursor: pointer; }
  .meta { display: flex; justify-content: space-between; font-size: 10px; color: #666; }
  .restore-action {
    background: #00ff88;
    color: #000;
    border: none;
    padding: 12px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
  }
  .restore-action:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,255,136,0.3); }

  .fade-in { animation: fadeIn 0.3s ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .empty-state { padding: 40px 20px; text-align: center; color: #444; font-size: 14px; }
  .footer { margin-top: 16px; font-size: 9px; color: #333; text-align: center; text-transform: uppercase; letter-spacing: 0.1em; }
</style>
