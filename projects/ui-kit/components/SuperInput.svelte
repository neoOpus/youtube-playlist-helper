<svelte:options runes={true} />
<script lang="ts">
  let {
    value = $bindable(""),
    placeholder = "",
    type = "text",
    id = "",
    label = "",
    error = "",
    disabled = false
  } = $props();
</script>

<div class="super-input-wrapper" class:has-error={error}>
  {#if label}
    <label for={id} class="input-label">{label}</label>
  {/if}
  <div class="input-container">
      <input
          {id}
          {type}
          bind:value={value}
          {placeholder}
          {disabled}
          class="pro-input"
          aria-invalid={!!error}
      />
      <div class="focus-ring"></div>
  </div>
  {#if error}
    <span class="error-text" transition:fade>{error}</span>
  {/if}
</div>

<style>
  .super-input-wrapper { display: flex; flex-direction: column; gap: var(--space-2); width: 100%; }
  .input-label { font-size: var(--font-xs); font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); }
  .input-container { position: relative; }
  .pro-input {
      width: 100%;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      color: var(--text);
      padding: var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--font-sm);
      font-weight: 700;
      transition: all 0.3s;
      outline: none;
  }
  .pro-input:focus { border-color: var(--primary); }
  .focus-ring {
      position: absolute;
      inset: -4px;
      border: 2px solid var(--primary);
      border-radius: calc(var(--radius-md) + 4px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s;
      transform: scale(0.98);
  }
  .pro-input:focus ~ .focus-ring { opacity: 0.2; transform: scale(1); }
  .error-text { font-size: var(--font-xs); font-weight: 700; color: var(--danger); margin-top: 2px; }
  .has-error .pro-input { border-color: var(--danger); }
</style>
