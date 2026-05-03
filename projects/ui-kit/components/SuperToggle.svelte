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
    <div class="thumb" class:checked={active}>
        {#if active}
            <div class="glow"></div>
        {/if}
    </div>
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
    padding: 2px;
  }

  .track {
    width: 44px;
    height: 24px;
    background: var(--bg-surface-3);
    border: 1px solid var(--border-strong);
    border-radius: 12px;
    position: relative;
    transition: all 0.3s var(--ease-spring);
  }

  .track.checked {
    background: var(--primary);
    border-color: var(--primary);
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2);
  }

  .thumb {
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: all 0.3s var(--ease-spring);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .thumb.checked {
    transform: translateX(20px);
  }

  .glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
      opacity: 0.1;
  }

  .label {
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--text-main);
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toggle-container:hover .track:not(.checked) {
      border-color: var(--primary);
  }
</style>
