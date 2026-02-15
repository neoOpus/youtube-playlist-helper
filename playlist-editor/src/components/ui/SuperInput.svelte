<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value = "";
  export let placeholder = "";
  export let type = "text";
  export let disabled = false;
  export let error = "";
  export let label = "";
  export const autofocus = false; // @ts-ignore

  const dispatch = createEventDispatcher();
  let input: HTMLInputElement;
  const id = "input-" + Math.random().toString(36).substr(2, 9);

  function handleInput(e: any) {
    value = e.target.value;
    dispatch("input", value);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
        dispatch("submit", value);
    }
  }

  export function focus() {
      input?.focus();
  }
</script>

<div class="super-input-container" class:has-error={!!error} class:is-disabled={disabled}>
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <div class="input-wrapper">
    <input
      bind:this={input}
      {id}
      {type}
      {value}
      {placeholder}
      {disabled}
      on:input={handleInput}
      on:keydown={handleKeyDown}
      on:blur={() => dispatch("blur")}
      on:focus={() => dispatch("focus")}
    />
    <div class="underline"></div>
  </div>
  {#if error}
    <span class="error-msg">{error}</span>
  {/if}
</div>

<style>
  .super-input-container { display: flex; flex-direction: column; gap: 4px; width: 100%; }
  label { font-size: 0.8rem; font-weight: 600; color: #666; }
  .input-wrapper { position: relative; }
  input { width: 100%; padding: 10px 0; border: none; border-bottom: 2px solid #ddd; background: transparent; font-size: 1rem; outline: none; transition: border-color 0.3s; color: inherit; }
  .underline { position: absolute; bottom: 0; left: 50%; width: 0; height: 2px; background: var(--sidebar-bg-color); transition: all 0.3s ease; transform: translateX(-50%); }
  input:focus + .underline { width: 100%; }
  .has-error input { border-bottom-color: #dc3545; }
  .has-error .underline { background: #dc3545; }
  .error-msg { font-size: 0.75rem; color: #dc3545; }
  .is-disabled { opacity: 0.6; pointer-events: none; }
</style>
