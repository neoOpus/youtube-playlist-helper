<script lang="ts">
  import { HardDrive } from "lucide-svelte";
  let { title = "Empty", message = "No data found.", actionLabel = "", actionClick = () => {} } = $props();
</script>

<div class="empty-state surface-1">
  <div class="icon-wrap"><HardDrive size="48" /></div>
  <h3>{title}</h3>
  <p>{message}</p>
  {#if actionLabel}
    <button class="action-btn" onclick={actionClick}>{actionLabel}</button>
  {/if}
</div>

<style>
  .empty-state {
    padding: 4rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem;
    background: var(--bg-surface-1); border-radius: 12px; border: 1px solid var(--border-base);
  }
  .icon-wrap { color: var(--text-muted); opacity: 0.2; }
  h3 { font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin: 0; }
  p { font-size: 0.9rem; color: var(--text-secondary); max-width: 300px; line-height: 1.5; }
  .action-btn {
      margin-top: 0.5rem; background: var(--primary); color: white; border: none;
      padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer;
  }
</style>
