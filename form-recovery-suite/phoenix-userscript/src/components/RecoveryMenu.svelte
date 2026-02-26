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
  const isYouTube = $derived(window.location.hostname.includes('youtube.com'));

  function handleKeydown(e: KeyboardEvent, value: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      onRestore(value);
    }
  }

  function sendToPlaylistHelper(value: string) {
    // Clever Trick: Cross-project deep link via localStorage or custom event
    // In a real SOTA app, we'd use a shared IndexedDB or a broadcast channel
    const channel = new BroadcastChannel('neoopus_integration');
    channel.postMessage({ type: 'IMPORT_DESCRIPTION', content: value });
    alert('Sent to neoOpus Playlist Helper for safekeeping!');
  }
</script>

<div class="phoenix-shell">
  <div class="glass-menu" role="dialog" aria-label="Phoenix Recovery Menu">
    <div class="header">
      <div class="brand">
        <span class="p">P</span>HOENIX
      </div>
      <button
        class="toggle-btn"
        onclick={() => showTimeMachine = !showTimeMachine}
        aria-pressed={showTimeMachine}
      >
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
          <label for="history-slider" class="sr-only">History Slider</label>
          <input
            id="history-slider"
            type="range"
            min="0"
            max={entries.length - 1}
            bind:value={historyIndex}
          />
          <div class="meta">
            <span class="time">{new Date(currentEntry?.timestamp || 0).toLocaleTimeString()}</span>
            <span class="ver">v{currentEntry?.version}</span>
          </div>
          <div class="actions-row">
            <button class="restore-action" onclick={() => onRestore(currentEntry.value)}>
              Restore
            </button>
            {#if isYouTube}
              <button class="integration-btn" onclick={() => sendToPlaylistHelper(currentEntry.value)}>
                Helper+
              </button>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <ul class="entry-list fade-in">
        {#each entries.slice(0, 8) as entry}
          <li>
            <button
              class="entry-button"
              onclick={() => onRestore(entry.value)}
              onkeydown={(e) => handleKeydown(e, entry.value)}
            >
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
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
  .phoenix-shell { font-family: 'Inter', system-ui, sans-serif; color: #fff; pointer-events: auto; }
  .glass-menu { background: rgba(18, 18, 20, 0.95); backdrop-filter: blur(24px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 12px 60px rgba(0,0,0,0.7); border-radius: 28px; width: 360px; padding: 18px; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .brand { font-size: 11px; font-weight: 900; letter-spacing: 0.3em; color: #666; display: flex; align-items: center; gap: 5px; }
  .brand .p { color: #00ff88; text-shadow: 0 0 15px rgba(0,255,136,0.6); }
  .toggle-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #aaa; padding: 8px 16px; border-radius: 16px; font-size: 10px; cursor: pointer; transition: 0.3s; font-weight: 600; }
  .toggle-btn:hover { background: rgba(255,255,255,0.1); color: #fff; transform: translateY(-1px); }

  .entry-list { list-style: none; padding: 0; margin: 0; }
  .entry-button { width: 100%; text-align: left; background: rgba(255,255,255,0.03); border: 1px solid transparent; border-radius: 20px; margin-bottom: 10px; padding: 16px; cursor: pointer; transition: 0.3s; color: inherit; }
  .entry-button:hover { background: rgba(255,255,255,0.08); border-color: rgba(0,255,136,0.3); transform: scale(1.02); }
  .val { font-size: 13px; line-height: 1.6; color: #ddd; display: block; word-break: break-word; }
  .sub { font-size: 9px; color: #444; margin-top: 10px; display: block; font-variant-numeric: tabular-nums; font-weight: 700; text-transform: uppercase; }

  .time-machine { display: flex; flex-direction: column; gap: 20px; }
  .preview-box { background: #000; border-radius: 18px; padding: 20px; height: 180px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
  pre { margin: 0; font-size: 12px; color: #00ff88; font-family: 'JetBrains Mono', monospace; white-space: pre-wrap; }
  .tm-controls { display: flex; flex-direction: column; gap: 15px; }
  input[type="range"] { width: 100%; accent-color: #00ff88; height: 4px; border-radius: 2px; }
  .meta { display: flex; justify-content: space-between; font-size: 9px; color: #444; font-weight: 700; }

  .actions-row { display: flex; gap: 10px; }
  .restore-action { flex: 2; background: #00ff88; color: #000; border: none; padding: 14px; border-radius: 16px; font-weight: 900; cursor: pointer; transition: 0.3s; text-transform: uppercase; letter-spacing: 0.1em; }
  .restore-action:hover { box-shadow: 0 10px 30px rgba(0,255,136,0.5); transform: translateY(-2px); }

  .integration-btn { flex: 1; background: #2563eb; color: #fff; border: none; padding: 14px; border-radius: 16px; font-weight: 900; cursor: pointer; transition: 0.3s; text-transform: uppercase; font-size: 9px; }
  .integration-btn:hover { box-shadow: 0 10px 30px rgba(37,99,235,0.4); transform: translateY(-2px); }

  .fade-in { animation: fadeIn 0.5s cubic-bezier(0.2, 1, 0.2, 1); }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .empty-state { padding: 60px 20px; text-align: center; color: #333; font-size: 14px; font-weight: 800; letter-spacing: 0.05em; }
  .footer { margin-top: 25px; font-size: 8px; color: #222; text-align: center; text-transform: uppercase; letter-spacing: 0.3em; font-weight: 900; }
</style>
