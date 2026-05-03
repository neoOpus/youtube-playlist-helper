<svelte:options runes={true} />
<script lang="ts">
  import { scale } from "svelte/transition";
  import { backOut } from "svelte/easing";

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
    class:active={checked === true || checked === 'mixed'}
    onclick={(e) => { e.stopPropagation(); toggle(); }}
    role="checkbox"
    aria-checked={checked === "mixed" ? "mixed" : checked}
    onkeydown={handleKeydown}
    tabindex={disabled ? -1 : 0}
>
  <div class="box">
    {#if checked === true}
      <div transition:scale={{ duration: 300, easing: backOut }}>
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
          </svg>
      </div>
    {:else if checked === 'mixed'}
      <div transition:scale={{ duration: 300, easing: backOut }}>
          <svg viewBox="0 0 24 24" width="14" height="14">
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
    gap: 10px;
    cursor: pointer;
    user-select: none;
    outline: none;
    padding: 2px;
    transition: all 0.2s;
  }

  .box {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-strong);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-surface-2);
    transition: all 0.2s var(--ease-spring);
    color: white;
    flex-shrink: 0;
  }

  .active .box {
    background: var(--primary);
    border-color: var(--primary);
    box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.3);
  }

  .checkbox-container:hover .box {
      border-color: var(--primary);
      transform: scale(1.05);
  }

  .label {
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--text-main);
  }

  .disabled { opacity: 0.5; cursor: not-allowed; }
</style>
