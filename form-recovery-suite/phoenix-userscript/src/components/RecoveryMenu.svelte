<script lang="ts">
  import { db, type FormEntry } from '../lib/db';
  import { maskPII } from '../lib/pii';
  import { exportToJSON, importFromJSON } from '../lib/backup';
  // @ts-ignore
  import Settings from './Settings.svelte';

  let { fieldId, onRestore } = $props();
  let entries = $state<FormEntry[]>([]);
  let historyIndex = $state(0);
  let view = $state<'list' | 'tm' | 'backup' | 'settings'>('list');

  let settings = $state({ ghosting: true, compression: true, vhash: true });

  $effect(() => {
    db.entries.where({ domain: window.location.hostname, fieldId }).reverse().sortBy('timestamp').then(res => {
      entries = res;
    });
  });

  const currentEntry = $derived(entries[historyIndex]);

  async function handleImport(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      await importFromJSON(file);
      alert('Import Complete!');
      location.reload();
    }
  }
</script>

<div class="phoenix-shell">
  <div class="glass-menu" role="dialog" aria-label="Phoenix Recovery Menu">
    <div class="header">
      <div class="brand">
        <span class="p">P</span>HOENIX
      </div>
      <div class="nav-btns">
        <button class="icon-btn" onclick={() => view = view === 'settings' ? 'list' : 'settings'} title="Settings">⚙️</button>
        <button class="icon-btn" onclick={() => view = view === 'backup' ? 'list' : 'backup'} title="Backup">💾</button>
        <button class="toggle-btn" onclick={() => view = view === 'tm' ? 'list' : 'tm'}>
          {view === 'tm' ? 'View List' : 'Time Machine'}
        </button>
      </div>
    </div>

    {#if view === 'settings'}
      <Settings {settings} onSave={(s) => { settings = s; view = 'list'; }} onClose={() => view = 'list'} />
    {:else if view === 'backup'}
      <div class="backup-view fade-in">
        <button class="action-btn" onclick={exportToJSON}>Export All Data</button>
        <label class="action-btn">
          Import Data
          <input type="file" onchange={handleImport} hidden />
        </label>
        <button class="toggle-btn" onclick={() => view = 'list'}>Back</button>
      </div>
    {:else if entries.length === 0}
      <div class="empty-state">No recovery path found</div>
    {:else if view === 'tm'}
      <div class="time-machine fade-in">
        <div class="preview-box">
          <pre>{maskPII(currentEntry?.value || '')}</pre>
        </div>
        <div class="tm-controls">
          <input type="range" min="0" max={entries.length - 1} bind:value={historyIndex} />
          <div class="meta">
            <span>{new Date(currentEntry?.timestamp || 0).toLocaleTimeString()}</span>
            <span>v{currentEntry?.version}</span>
          </div>
          <button class="restore-action" onclick={() => onRestore(currentEntry.value)}>Restore Snapshot</button>
        </div>
      </div>
    {:else}
      <ul class="entry-list fade-in">
        {#each entries.slice(0, 8) as entry}
          <li>
            <button class="entry-button" onclick={() => onRestore(entry.value)}>
              <div class="entry-content">
                <span class="val">{maskPII(entry.value.slice(0, 70))}</span>
                <span class="sub">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            </button>
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
  .phoenix-shell { font-family: 'Inter', system-ui, sans-serif; color: #fff; pointer-events: auto; }
  .glass-menu { background: rgba(18, 18, 20, 0.95); backdrop-filter: blur(24px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 12px 60px rgba(0,0,0,0.7); border-radius: 28px; width: 360px; padding: 18px; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .brand { font-size: 11px; font-weight: 900; letter-spacing: 0.3em; color: #666; }
  .brand .p { color: #00ff88; text-shadow: 0 0 15px rgba(0,255,136,0.6); }
  .nav-btns { display: flex; gap: 8px; align-items: center; }
  .icon-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px; filter: grayscale(1); transition: 0.2s; }
  .icon-btn:hover { filter: grayscale(0) scale(1.2); }
  .toggle-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #aaa; padding: 8px 16px; border-radius: 16px; font-size: 10px; cursor: pointer; transition: 0.3s; font-weight: 600; }
  .toggle-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

  .backup-view { display: flex; flex-direction: column; gap: 12px; padding: 10px; text-align: center; }
  .action-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #eee; padding: 12px; border-radius: 14px; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; }
  .action-btn:hover { background: rgba(255,255,255,0.1); border-color: #00ff88; }

  .entry-list { list-style: none; padding: 0; margin: 0; }
  .entry-button { width: 100%; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid transparent; border-radius: 20px; margin-bottom: 10px; padding: 16px; cursor: pointer; transition: 0.3s; color: inherit; }
  .entry-button:hover { background: rgba(255,255,255,0.08); border-color: rgba(0,255,136,0.3); transform: scale(1.01); }
  .val { font-size: 13px; line-height: 1.6; color: #ddd; display: block; word-break: break-word; }
  .sub { font-size: 9px; color: #444; margin-top: 10px; display: block; font-variant-numeric: tabular-nums; font-weight: 700; text-transform: uppercase; }

  .time-machine { display: flex; flex-direction: column; gap: 20px; }
  .preview-box { background: #000; border-radius: 18px; padding: 20px; height: 180px; overflow-y: auto; border: 1px solid rgba(255, 255, 255, 0.05); }
  pre { margin: 0; font-size: 12px; color: #00ff88; font-family: 'JetBrains Mono', monospace; white-space: pre-wrap; }
  .tm-controls { display: flex; flex-direction: column; gap: 15px; }
  input[type="range"] { width: 100%; accent-color: #00ff88; height: 4px; }
  .meta { display: flex; justify-content: space-between; font-size: 9px; color: #444; font-weight: 700; }
  .restore-action { background: #00ff88; color: #000; border: none; padding: 14px; border-radius: 16px; font-weight: 900; cursor: pointer; transition: 0.3s; text-transform: uppercase; letter-spacing: 0.1em; width: 100%; }
  .restore-action:hover { box-shadow: 0 10px 30px rgba(0,255,136,0.5); transform: translateY(-2px); }

  .fade-in { animation: fadeIn 0.4s ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

  .empty-state { padding: 60px 20px; text-align: center; color: #333; font-size: 14px; font-weight: 800; }
  .footer { margin-top: 25px; font-size: 8px; color: #222; text-align: center; text-transform: uppercase; letter-spacing: 0.3em; font-weight: 900; }
</style>
