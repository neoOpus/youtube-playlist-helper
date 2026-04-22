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

<div class="select-wrapper">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <div class="container">
      <select {id} bind:value={value} {disabled}>
          {#each options as option}
              <option value={option.value}>{option.label}</option>
          {/each}
      </select>
      <div class="arrow"></div>
  </div>
</div>

<style>
  .select-wrapper { display: flex; flex-direction: column; gap: 8px; width: 100%; }
  label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .container { position: relative; }
  select {
      width: 100%;
      background: var(--bg-surface-2);
      border: 1px solid var(--border-strong);
      color: var(--text-main);
      padding: 10px 40px 10px 16px;
      border-radius: 8px;
      font-size: var(--font-sm);
      font-weight: 600;
      appearance: none;
      outline: none;
      cursor: pointer;
      transition: all 0.2s;
  }
  select:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1); }
  .arrow {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 0; height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid var(--text-muted);
      pointer-events: none;
  }
</style>
