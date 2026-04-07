<svelte:options runes={true} />
<script lang="ts">
  let { size = 24, color = "var(--primary)" } = $props();
</script>

<div
    class="loading-spinner"
    style="width: ${size}px; height: ${size}px; border-color: ${color} transparent ${color} transparent;"
></div>

<style>
  .loading-spinner {
    display: inline-block;
    border-style: solid;
    border-width: 3px;
    border-radius: 50%;
    animation: spin 0.5s linear infinite; /* 2Hz frequency (0.5s period) */
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
