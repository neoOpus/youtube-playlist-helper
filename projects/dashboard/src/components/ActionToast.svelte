<script lang="ts">
  import { onMount } from "svelte";
</script>

<div id="toast-portal"></div>

<style>
  #toast-portal {
    position: fixed; bottom: 1rem; right: 1rem; z-index: 1000;
    display: flex; flex-direction: column; gap: 0.5rem;
  }
</style>
