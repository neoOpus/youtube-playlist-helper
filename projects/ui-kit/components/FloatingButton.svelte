<script lang="ts">
  import SmartElement from "./SmartElement.svelte";

  export let bgcolor = "";
  export let className = "";
</script>

<SmartElement
  className="floating-button {className}"
  style={bgcolor ? "background-color: " + bgcolor : ""}
  on:click
>
  <slot />
</SmartElement>

<style>
  :global(.floating-button) {
    position: fixed;
    bottom: 2em;
    right: 2em;
    width: 3.5em;
    height: 3.5em;
    border-radius: 50%;
    background-color: var(--sidebar-bg-color);
    color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    cursor: pointer;
    z-index: 100;
  }
</style>
