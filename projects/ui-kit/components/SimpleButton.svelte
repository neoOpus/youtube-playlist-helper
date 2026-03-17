<script lang="ts">
  import SmartElement from "./SmartElement.svelte";
  export let className = "";
</script>

<SmartElement className="simple-btn {className}" on:click>
  <slot />
</SmartElement>

<style>
  :global(.simple-btn) {
    border: 1px solid var(--border-color);
    background: transparent;
    padding: 0.4em 0.8em;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
