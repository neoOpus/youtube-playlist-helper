<svelte:options runes={true} />
<script lang="ts">
  interface Option {
    value: string;
    label: string;
  }

  interface Props {
    options: Option[];
    value?: string;
    name: string;
    label?: string;
    onchange?: (val: string) => void;
  }

  let { options, value = $bindable(""), name, label = "", onchange }: Props = $props();

  function select(opt: string) {
    value = opt;
    if (onchange) onchange(opt);
  }
</script>

<div class="radio-group" role="radiogroup" aria-label={label}>
  {#if label}
    <span class="group-label">{label}</span>
  {/if}
  <div class="options-container">
    {#each options as opt}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="radio-item"
        onclick={() => select(opt.value)}
        role="radio"
        aria-checked={value === opt.value}
        tabindex={value === opt.value ? 0 : -1}
        onkeydown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            select(opt.value);
          }
        }}
      >
        <div class="radio-circle" class:checked={value === opt.value}>
          {#if value === opt.value}
            <div class="radio-inner"></div>
          {/if}
        </div>
        <span class="radio-label">{opt.label}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .group-label {
    font-size: var(--font-xs);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-dim);
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .radio-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    cursor: pointer;
    outline: none;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    transition: background var(--duration-fast);
  }

  .radio-item:hover {
    background: var(--hover);
  }

  .radio-circle {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-strong);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--duration-fast);
    background: var(--bg-secondary);
  }

  .radio-circle.checked {
    border-color: var(--primary);
    box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.2);
  }

  .radio-inner {
    width: 10px;
    height: 10px;
    background: var(--primary);
    border-radius: 50%;
    box-shadow: 0 0 5px var(--primary);
  }

  .radio-label {
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--text);
  }

  .radio-item:focus-visible {
    box-shadow: 0 0 0 2px var(--primary);
  }
</style>
