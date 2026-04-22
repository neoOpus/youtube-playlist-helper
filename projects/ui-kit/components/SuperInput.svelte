<svelte:options runes={true} />
<script lang="ts">
  import { fade } from "svelte/transition";
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
  </div>
  {#if error}
    <span class="error-text" transition:fade>{error}</span>
  {/if}
</div>

<style>
  .super-input-wrapper { display: flex; flex-direction: column; gap: var(--space-2); width: 100%; }
  .input-label { font-size: var(--font-xs); font-weight: 800; text-transform: uppercase; color: var(--text-secondary); }
  .input-container { position: relative; }
  .pro-input {
      width: 100%;
      background: var(--bg-surface-2);
      border: 1px solid var(--border-strong);
      color: var(--text-main);
      padding: 12px 16px;
      border-radius: 8px;
      font-size: var(--font-sm);
      font-weight: 600;
      transition: all 0.2s var(--ease-in-out);
      outline: none;
  }
  .pro-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1); }
  .error-text { font-size: var(--font-xs); font-weight: 700; color: var(--danger); margin-top: 2px; }
  .has-error .pro-input { border-color: var(--danger); }
</style>
