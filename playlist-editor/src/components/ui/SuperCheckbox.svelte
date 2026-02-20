<script lang="ts">
  import { spring } from 'svelte/motion';
  import { createEventDispatcher } from 'svelte';
  import Fa from 'svelte-fa';
  import { faCheck } from '@fortawesome/free-solid-svg-icons';

  export let checked = false;
  export let label = "";
  export let disabled = false;

  const dispatch = createEventDispatcher();

  const checkScale = spring(checked ? 1 : 0, {
    stiffness: 0.15,
    damping: 0.4
  });

  $: checkScale.set(checked ? 1 : 0);

  function toggle() {
    if (disabled) return;
    checked = !checked;
    dispatch('change', checked);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="super-checkbox-container" class:disabled on:click={toggle}>
  <div class="box" class:checked>
    <div class="inner" style="transform: scale({$checkScale})">
        <Fa icon={faCheck} size="xs" />
    </div>
  </div>
  {#if label}
    <span class="label">{label}</span>
  {/if}
</div>

<style>
  .super-checkbox-container {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
  }

  .box {
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    background: white;
  }

  .box.checked {
    background: var(--sidebar-bg-color);
    border-color: var(--sidebar-bg-color);
    color: white;
  }

  .inner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    font-size: 0.95rem;
    color: #4b5563;
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .super-checkbox-container:hover .box:not(.checked) {
      border-color: var(--sidebar-bg-color);
  }
</style>
