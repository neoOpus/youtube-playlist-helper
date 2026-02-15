<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let options: { value: string; label: string }[] = [];
  export let value = "";
  export let label = "";
  export let disabled = false;

  const dispatch = createEventDispatcher();
  const id = "select-" + Math.random().toString(36).substr(2, 9);

  function handleChange(e: any) {
    value = e.target.value;
    dispatch("change", value);
  }
</script>

<div class="super-select-container" class:is-disabled={disabled}>
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <div class="select-wrapper">
    <select {id} {value} {disabled} on:change={handleChange}>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    <div class="arrow"></div>
  </div>
</div>

<style>
  .super-select-container { display: flex; flex-direction: column; gap: 4px; }
  label { font-size: 0.8rem; font-weight: 600; color: #666; }
  .select-wrapper { position: relative; }
  select { width: 100%; padding: 10px; padding-right: 30px; border: 1px solid #ddd; border-radius: 8px; background: white; font-size: 1rem; outline: none; appearance: none; cursor: pointer; }
  .arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #666; pointer-events: none; }
  .is-disabled { opacity: 0.6; pointer-events: none; }
</style>
