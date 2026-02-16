<script lang="ts">
  import { db, type SavedEntry } from '../lib/db';

  let { fieldId, onRestore } = $props();
  let entries = $state<SavedEntry[]>([]);

  $effect(() => {
    db.entries.where({ domain: window.location.hostname, fieldId }).reverse().sortBy('timestamp').then(res => {
      entries = res;
    });
  });
</script>

<div class="phoenix-menu">
  {#if entries.length === 0}
    <div class="no-entries">No history found</div>
  {:else}
    <ul>
      {#each entries as entry}
        <li onclick={() => onRestore(entry.value)}>
          <span class="value">{entry.value.slice(0, 50)}...</span>
          <span class="date">{new Date(entry.timestamp).toLocaleString()}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .phoenix-menu {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 1000000;
    max-height: 300px;
    overflow-y: auto;
    width: 300px;
    border-radius: 8px;
    padding: 8px;
    font-family: sans-serif;
  }
  ul { list-style: none; padding: 0; margin: 0; }
  li {
    padding: 8px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }
  li:hover { background: #f0f0f0; }
  .value { font-weight: bold; font-size: 14px; color: #333; }
  .date { font-size: 11px; color: #666; margin-top: 4px; }
  .no-entries { padding: 10px; color: #999; }
</style>
