<svelte:options runes={true} />
<script lang="ts">
  import { lastAction } from "@yph/core";
  import { fade } from "svelte/transition";
</script>

{#if $lastAction}
  <div class="undo-pill" in:fade>
    <span>Action Protocol: {$lastAction.name}</span>
  </div>
{/if}

<style>
    .undo-pill { position: fixed; top: 20px; right: 20px; background: var(--primary); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 800; font-size: 10px; z-index: 10000; }
</style>
