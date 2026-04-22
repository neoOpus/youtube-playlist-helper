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
    if (checked === "mixed") checked = true;
    else checked = !checked;
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
    class="checkbox-container"
    class:disabled
    onclick={(e) => { e.stopPropagation(); toggle(); }}
    role="checkbox"
    aria-checked={checked === "mixed" ? "mixed" : checked}
    onkeydown={handleKeydown}
    tabindex={disabled ? -1 : 0}
>
  <div class="box" class:checked={checked === true || checked === 'mixed'}>
    {#if checked === true}
      <div transition:scale={{ duration: 150 }}>
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
          </svg>
      </div>
    {:else if checked === 'mixed'}
      <div transition:scale={{ duration: 150 }}>
          <svg viewBox="0 0 24 24" width="12" height="12">
            <rect fill="currentColor" x="4" y="10" width="16" height="4" rx="1" />
          </svg>
      </div>
    {/if}
  </div>
  {#if label}
    <span class="label">{label}</span>
  {/if}
</div>

<style>
  .checkbox-container {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    outline: none;
  }

  .box {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-strong);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-surface-2);
    transition: all 0.2s;
    color: white;
    flex-shrink: 0;
  }

  .box.checked {
    background: var(--primary);
    border-color: var(--primary);
  }

  .label {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--text-main);
  }

  .disabled { opacity: 0.5; cursor: not-allowed; }
</style>
