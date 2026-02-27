<script lang="ts">
  let { settings, onSave, onClose } = $props();
  let localSettings = $state({ ...settings });
</script>

<div class="settings-modal fade-in">
  <h3>Phoenix Settings</h3>
  <div class="opt">
    <label>
      <input type="checkbox" bind:checked={localSettings.ghosting} />
      Smart Ghosting
    </label>
    <p>Predictive completions in empty fields.</p>
  </div>
  <div class="opt">
    <label>
      <input type="checkbox" bind:checked={localSettings.compression} />
      Delta Compression
    </label>
    <p>Efficient storage for large text areas.</p>
  </div>
  <div class="opt">
    <label>
      <input type="checkbox" bind:checked={localSettings.vhash} />
      V-Hash Robustness
    </label>
    <p>Structural fingerprinting of fields.</p>
  </div>

  <div class="actions">
    <button class="save" onclick={() => onSave(localSettings)}>Apply</button>
    <button class="close" onclick={onClose}>Cancel</button>
  </div>
</div>

<style>
  .settings-modal { padding: 10px; color: #eee; }
  h3 { margin: 0 0 15px; font-size: 14px; color: #00ff88; text-transform: uppercase; }
  .opt { margin-bottom: 15px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 10px; }
  label { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: bold; cursor: pointer; }
  p { margin: 5px 0 0 25px; font-size: 10px; color: #666; }
  .actions { display: flex; gap: 10px; margin-top: 20px; }
  button { flex: 1; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; }
  .save { background: #00ff88; color: #000; }
  .close { background: #333; color: #fff; }
</style>
