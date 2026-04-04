<svelte:options runes={true} />
<script lang="ts">
  interface Props {
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    onchange?: (val: boolean) => void;
  }

  let { checked = $bindable(false), disabled = false, label = "", onchange }: Props = $props();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    if (onchange) onchange(checked);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="super-toggle-container"
  class:disabled
  onclick={toggle}
  role="switch"
  aria-checked={checked}
  tabindex={disabled ? -1 : 0}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle())}
>
  <div class="toggle-track" class:checked>
    <div class="toggle-thumb" class:checked></div>
  </div>
  {#if label}
    <span class="toggle-label">{label}</span>
  {/if}
</div>

<style>
  .super-toggle-container {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    cursor: pointer;
    user-select: none;
    outline: none;
  }

  .toggle-track {
    width: 44px;
    height: 22px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-full);
    position: relative;
    transition: all var(--duration-fast) var(--easing-standard);
  }

  .toggle-track.checked {
    background: var(--primary);
    border-color: var(--primary);
    box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.3);
  }

  .toggle-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform var(--duration-fast) var(--easing-standard);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .toggle-thumb.checked {
    transform: translateX(22px);
  }

  .toggle-label {
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--text);
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .super-toggle-container:focus-visible .toggle-track {
    box-shadow: 0 0 0 2px var(--primary);
    outline-offset: 2px;
  }
</style>
