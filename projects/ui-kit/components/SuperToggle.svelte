<svelte:options runes={true} />
<script lang="ts">
  import { spring } from 'svelte/motion';

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    onchange?: (val: boolean) => void;
  }

  let { checked = $bindable(false), disabled = false, label = "", onchange }: Props = $props();

  const thumbX = spring(checked ? 22 : 0, {
      stiffness: 0.15,
      damping: 0.4
  });

  const scale = spring(1, {
      stiffness: 0.2,
      damping: 0.5
  });

  function toggle() {
    if (disabled) return;
    checked = !checked;
    if (onchange) onchange(checked);
  }

  $effect(() => {
      thumbX.set(checked ? 22 : 0);
  });
</script>

<div
  class="super-toggle-container"
  class:disabled
  onclick={toggle}
  onmousedown={() => scale.set(0.94)}
  onmouseup={() => scale.set(1)}
  onmouseleave={() => scale.set(1)}
  role="switch"
  aria-checked={checked}
  tabindex={disabled ? -1 : 0}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle())}
  style="transform: scale({$scale});"
>
  <div class="toggle-track" class:checked={checked}>
    <div class="toggle-thumb" style="transform: translateX({$thumbX}px);"></div>
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
    transition: transform 0.1s ease;
  }

  .toggle-track {
    width: 44px;
    height: 22px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-full);
    position: relative;
    transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
  }

  .toggle-track.checked {
    background: var(--primary);
    border-color: var(--primary);
    box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.4);
  }

  .toggle-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }

  .toggle-label {
    font-size: var(--font-xs);
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: color 0.2s;
  }

  .super-toggle-container:hover .toggle-label { color: var(--text); }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .super-toggle-container:focus-visible .toggle-track {
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.4);
  }
</style>
