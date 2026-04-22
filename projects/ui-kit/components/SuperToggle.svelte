<svelte:options runes={true} />
<script lang="ts">
  interface Props {
    active?: boolean;
    disabled?: boolean;
    label?: string;
    onchange?: (val: boolean) => void;
  }

  let { active = $bindable(false), disabled = false, label = "", onchange }: Props = $props();

  function toggle() {
    if (disabled) return;
    active = !active;
    if (onchange) onchange(active);
  }
</script>

<div
  class="toggle-container"
  class:disabled
  onclick={toggle}
  role="switch"
  aria-checked={active}
  tabindex={disabled ? -1 : 0}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle())}
>
  <div class="track" class:checked={active}>
    <div class="thumb" class:checked={active}></div>
  </div>
  {#if label}
    <span class="label">{label}</span>
  {/if}
</div>

<style>
  .toggle-container {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
    outline: none;
  }

  .track {
    width: 36px;
    height: 20px;
    background: var(--bg-surface-3);
    border: 1px solid var(--border-strong);
    border-radius: 10px;
    position: relative;
    transition: all 0.2s var(--ease-in-out);
  }

  .track.checked {
    background: var(--primary);
    border-color: var(--primary);
  }

  .thumb {
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s var(--ease-in-out);
  }

  .thumb.checked {
    transform: translateX(16px);
  }

  .label {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--text-main);
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
