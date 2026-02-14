<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { CloseIcon, PencilIcon } from "./icons/index.js";

  export let collapsed = false;
  export let width = "240px";
  export let collapsedWidth = "60px";

  const dispatch = createEventDispatcher();

  function toggle() {
    collapsed = !collapsed;
    dispatch("toggle", collapsed);
  }
</script>

<aside
    class="sidebar"
    class:is-collapsed={collapsed}
    style="width: {collapsed ? collapsedWidth : width}"
>
  <button class="toggle-btn" on:click={toggle}>
    {#if collapsed}
        <span>☰</span>
    {:else}
        <span>✕</span>
    {/if}
  </button>

  <div class="content">
    <slot />
  </div>
</aside>

<style>
  .sidebar {
    height: 100%;
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    background-color: var(--sidebar-bg-color);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  .toggle-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    padding: 1rem;
    cursor: pointer;
    text-align: left;
    outline: none;
  }

  .content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
  }

  .is-collapsed :global(.logo),
  .is-collapsed :global(a span) {
      display: none;
  }
</style>
