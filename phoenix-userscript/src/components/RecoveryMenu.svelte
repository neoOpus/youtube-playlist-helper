<script lang="ts">
  import { db, type SavedEntry } from '../lib/db';
  import { maskPII } from '../lib/pii';

  let { fieldId, onRestore } = $props();
  let entries = $state<SavedEntry[]>([]);
  let historyIndex = $state(0);
  let showTimeMachine = $state(false);

  $effect(() => {
    db.entries.where({ domain: window.location.hostname, fieldId }).reverse().sortBy('timestamp').then(res => {
      entries = res;
    });
  });

  const currentEntry = $derived(entries[historyIndex]);
</script>

<div class="phoenix-menu">
  <div class="header">
    <span>Phoenix SOTA Recovery</span>
    <button class="toggle" onclick={() => showTimeMachine = !showTimeMachine}>
      {showTimeMachine ? 'List' : 'Time Machine'}
    </button>
  </div>

  {#if entries.length === 0}
    <div class="no-entries">No history found</div>
  {:else if showTimeMachine}
    <div class="time-machine">
      <div class="preview">
        {maskPII(currentEntry?.value || '')}
      </div>
      <div class="controls">
        <input type="range" min="0" max={entries.length - 1} bind:value={historyIndex} />
        <div class="timestamp">
          {new Date(currentEntry?.timestamp || 0).toLocaleString()}
        </div>
        <button class="restore-btn" onclick={() => onRestore(currentEntry.value)}>
          Restore this point
        </button>
      </div>
    </div>
  {:else}
    <ul>
      {#each entries.slice(0, 10) as entry}
        <li onclick={() => onRestore(entry.value)}>
          <span class="value">{maskPII(entry.value.slice(0, 80))}</span>
          <span class="date">{new Date(entry.timestamp).toLocaleTimeString()}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .phoenix-menu {
    position: absolute;
    background: #121212;
    color: #fff;
    border: 1px solid #333;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    z-index: 2147483647;
    width: 340px;
    border-radius: 16px;
    padding: 12px;
    font-family: 'Inter', system-ui, sans-serif;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #666;
  }
  .toggle {
    background: #222;
    color: #aaa;
    border: 1px solid #444;
    padding: 4px 10px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 10px;
    transition: all 0.2s;
  }
  .toggle:hover { color: #fff; border-color: #666; }
  ul { list-style: none; padding: 0; margin: 0; }
  li {
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    margin-bottom: 6px;
    background: #1a1a1a;
    transition: transform 0.2s, background 0.2s;
  }
  li:hover { background: #252525; transform: translateY(-1px); }
  .value { font-size: 13px; line-height: 1.5; color: #ddd; display: block; }
  .date { font-size: 10px; color: #555; margin-top: 8px; font-variant-numeric: tabular-nums; }

  .time-machine { padding: 4px; }
  .preview {
    background: #000;
    padding: 15px;
    border-radius: 10px;
    min-height: 100px;
    max-height: 200px;
    overflow-y: auto;
    font-size: 13px;
    color: #0f0;
    font-family: monospace;
    margin-bottom: 15px;
    border: 1px solid #111;
  }
  .controls { display: flex; flex-direction: column; gap: 10px; }
  input[type="range"] { width: 100%; accent-color: #0f0; }
  .timestamp { font-size: 11px; text-align: center; color: #888; }
  .restore-btn {
    background: #0f0;
    color: #000;
    border: none;
    padding: 10px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .restore-btn:hover { opacity: 0.8; }
  .no-entries { padding: 30px; text-align: center; color: #444; font-size: 13px; }
</style>
