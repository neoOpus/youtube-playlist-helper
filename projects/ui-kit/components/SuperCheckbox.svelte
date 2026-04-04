<svelte:options runes={true} />
<script lang="ts">
  import { scale } from "svelte/transition";

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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="super-checkbox-container"
    class:disabled
    onclick={(e) => { e.stopPropagation(); toggle(); }}
    role="checkbox"
    aria-checked={checked === "mixed" ? "mixed" : checked}
    onkeydown={handleKeydown}
    tabindex={disabled ? -1 : 0}
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
    transition: all 0.2s;
  }

  .super-checkbox-container:hover:not(.disabled) .checkbox-box {
      border-color: var(--primary);
  }

  .super-checkbox-container:focus-visible {
      box-shadow: 0 0 0 2px var(--primary);
      outline-offset: 2px;
  }

  .checkbox-box {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-strong);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: white;
    flex-shrink: 0;
  }

  .checkbox-box.checked {
    background: var(--primary);
    border-color: var(--primary);
    box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.4);
  }

  .checkbox-label {
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--text);
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
