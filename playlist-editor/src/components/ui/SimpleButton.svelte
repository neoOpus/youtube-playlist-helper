<script lang="ts">
  export let className = "";
  export let title = "";
</script>

<button class="btn {className}" {title} on:click aria-label={title || "button"}>
  <slot />
</button>

<style>
  .btn {
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
