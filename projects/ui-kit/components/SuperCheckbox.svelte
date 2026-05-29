<svelte:options runes={true} />
<script lang="ts">
  import { scale } from "svelte/transition";
  import { spring } from "svelte/motion";

  interface Props {
    checked?: boolean | "mixed";
    disabled?: boolean;
    label?: string;
    onchange?: (val: boolean | "mixed") => void;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    label = "",
    onchange = (val: boolean | "mixed") => {}
  }: Props = $props();

  const boxScale = spring(1, { stiffness: 0.2, damping: 0.5 });

  function toggle() {
    if (disabled) return;
    if (checked === "mixed") {
        checked = true;
    } else {
        checked = !checked;
    }
    if (onchange) onchange(checked);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }
</script>

<div
    class="super-checkbox-container"
    class:disabled
    onclick={(e) => { e.stopPropagation(); toggle(); }}
    onmousedown={() => boxScale.set(0.85)}
    onmouseup={() => boxScale.set(1)}
    onmouseleave={() => boxScale.set(1)}
    role="checkbox"
    aria-checked={checked === "mixed" ? "mixed" : checked}
    onkeydown={handleKeydown}
    tabindex={disabled ? -1 : 0}
    style="transform: scale({$boxScale});"
>
  <div class="checkbox-box" class:checked={checked === true || checked === 'mixed'}>
    {#if checked === true}
      <div transition:scale={{ duration: 200 }}>
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
          </svg>
      </div>
    {:else if checked === 'mixed'}
      <div transition:scale={{ duration: 200 }}>
          <svg viewBox="0 0 24 24" width="14" height="14">
            <rect fill="currentColor" x="4" y="10" width="16" height="4" rx="1" />
          </svg>
      </div>
    {/if}
  </div>
  {#if label}
    <span class="checkbox-label">{label}</span>
  {/if}
</div>

<style>
  .super-checkbox-container {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    user-select: none;
    outline: none;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    transition: transform 0.1s ease;
  }

  .super-checkbox-container:hover:not(.disabled) .checkbox-box {
      border-color: var(--primary);
  }

  .checkbox-box {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-strong);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: white;
    flex-shrink: 0;
  }

  .checkbox-box.checked {
    background: var(--primary);
    border-color: var(--primary);
    box-shadow: 0 0 12px rgba(var(--primary-rgb), 0.5);
  }

  .checkbox-label {
    font-size: var(--font-xs);
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
