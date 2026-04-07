<svelte:options runes={true} />
<script lang="ts">
  let {
    value = $bindable(),
    options = [],
    label = "",
    id = "",
    disabled = false
  } = $props();
</script>

<div class="super-select-wrapper">
  {#if label}
    <label for={id} class="input-label">{label}</label>
  {/if}
  <div class="select-container">
      <select
          {id}
          bind:value={value}
          {disabled}
          class="pro-select"
      >
          {#each options as option}
              <option value={option.value}>{option.label}</option>
          {/each}
      </select>
      <div class="select-arrow"></div>
  </div>
</div>

<style>
  .super-select-wrapper { display: flex; flex-direction: column; gap: var(--space-2); width: 100%; }
  .input-label { font-size: var(--font-xs); font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); }
  .select-container { position: relative; }
  .pro-select {
      width: 100%;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      color: var(--text);
      padding: var(--space-4);
      padding-right: var(--space-10);
      border-radius: var(--radius-md);
      font-size: var(--font-sm);
      font-weight: 700;
      appearance: none;
      outline: none;
      cursor: pointer;
      transition: all 0.3s;
  }
  .pro-select:focus { border-color: var(--primary); }
  .select-arrow {
      position: absolute;
      right: var(--space-4);
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      background: var(--text-muted);
      clip-path: polygon(100% 0%, 0% 0%, 50% 100%);
      pointer-events: none;
      opacity: 0.5;
  }
</style>
