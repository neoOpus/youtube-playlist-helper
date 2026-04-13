<script lang="ts">
  interface Props {
    value?: string;
    placeholder?: string;
    label?: string;
    error?: string;
    type?: string;
    disabled?: boolean;
    class?: string;
    ariaLabel?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
  }

  let {
    value = $state(''),
    placeholder = '',
    label = '',
    error = '',
    type = 'text',
    disabled = false,
    class: className = '',
    ariaLabel = '',
    oninput,
    onchange
  }: Props = $props();
</script>

<div class="sota-input-wrapper {className} {error ? 'has-error' : ''}">
  {#if label}
    <label for="input" class="sota-label">{label}</label>
  {/if}
  <div class="input-container">
    <input
      id="input"
      {type}
      {placeholder}
      {disabled}
      bind:value={value}
      oninput={oninput}
      onchange={onchange}
      aria-label={ariaLabel || label || placeholder}
      aria-invalid={!!error}
    />
    <div class="focus-ring"></div>
  </div>
  {#if error}
    <span class="error-text" transition:fade>{error}</span>
  {/if}
</div>

<style>
  .sota-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    width: 100%;
  }

  .sota-label {
    font-size: var(--size-xs);
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .input-container {
    position: relative;
    width: 100%;
  }

  input {
    width: 100%;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: var(--spacing-3) var(--spacing-4);
    color: var(--text-primary);
    font-family: var(--font-main);
    font-size: var(--size-sm);
    transition: all var(--trans-fast);
    outline: none;
  }

  input:hover:not(:disabled) {
    border-color: var(--border-strong);
    background: rgba(255, 255, 255, 0.02);
  }

  input:focus {
    border-color: var(--accent-color);
    background: rgba(0, 0, 0, 0.3);
  }

  .focus-ring {
    position: absolute;
    inset: -3px;
    border: 2px solid var(--accent-color);
    border-radius: calc(var(--radius-md) + 3px);
    opacity: 0;
    transition: all var(--trans-fast);
    pointer-events: none;
    transform: scale(0.98);
  }

  input:focus + .focus-ring {
    opacity: 0.3;
    transform: scale(1);
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .has-error input {
    border-color: #ff3232;
  }

  .error-text {
    font-size: var(--size-xs);
    color: #ff3232;
    margin-top: var(--spacing-1);
  }
</style>
