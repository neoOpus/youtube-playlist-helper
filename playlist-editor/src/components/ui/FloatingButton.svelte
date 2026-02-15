<script lang="ts">
  export let bgcolor = "#007bff";
  export let title = "";
</script>

<button
    class="fab"
    style="background-color: {bgcolor}"
    on:click
    title={title}
    aria-label={title || "action"}
>
  <slot />
  {#if !!title}
    <span class="tooltip" style="background-color: {bgcolor}">{title}</span>
  {/if}
</button>

<style>
  .fab {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    transition: all 0.2s;
    border: none;
    position: relative;
  }

  .fab:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
  }

  .tooltip {
    visibility: hidden;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 100;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    font-size: 0.8rem;
  }

  .fab:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
</style>
