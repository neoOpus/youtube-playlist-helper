<svelte:options runes={true} />
<script lang="ts">
  import { SuperButton } from "@yph/ui-kit";
  import { HardDrive } from "lucide-svelte";
  let { title = "Empty", message = "No data found.", actionLabel = "", actionClick = () => {} } = $props();
</script>

<div class="empty-state surface-1">
  <div class="icon-wrap"><HardDrive size="48" /></div>
  <h3>{title}</h3>
  <p>{message}</p>
  {#if actionLabel}
    <div class="mt-6">
        <SuperButton primary onclick={actionClick}>{actionLabel}</SuperButton>
    </div>
  {/if}
</div>

<style>
  .empty-state {
    padding: 60px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;
  }
  .icon-wrap { color: var(--text-muted); opacity: 0.3; }
  h3 { font-size: 1.25rem; font-weight: 800; color: var(--text-main); }
  p { font-size: 0.95rem; color: var(--text-secondary); max-width: 400px; line-height: 1.6; font-weight: 500; }
  .mt-6 { margin-top: 1.5rem; }
</style>
