<script lang="ts">
  interface Props {
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    onchange?: (checked: boolean) => void;
  }

  let {
    checked = $state(false),
    label = '',
    disabled = false,
    onchange
  }: Props = $props();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    if (onchange) onchange(checked);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="sota-toggle-container {disabled ? 'disabled' : ''}"
  onclick={toggle}
  role="checkbox"
  aria-checked={checked}
  tabindex={disabled ? -1 : 0}
  onkeydown={e => (e.key === ' ' || e.key === 'Enter') && toggle()}
>
  <div class="toggle-track {checked ? 'checked' : ''}">
    <div class="toggle-thumb"></div>
  </div>
  {#if label}
    <span class="toggle-label">{label}</span>
  {/if}
</div>

<style>
  .sota-toggle-container {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-3);
    cursor: pointer;
    user-select: none;
    outline: none;
  }

  .disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .toggle-track {
    width: 44px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    position: relative;
    transition: all var(--trans-normal);
    border: 1px solid var(--border-subtle);
  }

  .toggle-track.checked {
    background: var(--accent-color);
    border-color: transparent;
    box-shadow: 0 0 15px var(--accent-glow);
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    transition: transform var(--trans-normal);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .checked .toggle-thumb {
    transform: translateX(20px);
  }

  .toggle-label {
    font-size: var(--size-sm);
    color: var(--text-primary);
    font-weight: 500;
  }

  .sota-toggle-container:focus-visible .toggle-track {
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
</style>
