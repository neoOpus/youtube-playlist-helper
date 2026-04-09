<svelte:options runes={true} />
<script lang="ts">
  import { ShieldAlert, PlusCircle } from "lucide-svelte";

  interface Props {
    title?: string;
    message?: string;
    actionLabel?: string;
    actionClick?: (e: MouseEvent) => void;
  }

  let {
    title = "No Data Found",
    message = "The intelligence grid is currently empty.",
    actionLabel = "",
    actionClick = () => {}
  }: Props = $props();
</script>

<div class="empty-state-container pro-glass p-12">
    <div class="icon-blob">
        <ShieldAlert size="48" color="var(--primary)" />
    </div>
    <h3 class="mt-6 text-xl font-bold">{title}</h3>
    <p class="muted mt-2 max-w-xs text-center">{message}</p>

    {#if actionLabel}
        <button class="pro-btn primary mt-8" onclick={actionClick}>
            <PlusCircle size="18" />
            <span>{actionLabel}</span>
        </button>
    {/if}
</div>

<style>
    .empty-state-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px dashed var(--border-strong);
        min-height: 400px;
    }

    .icon-blob {
        width: 100px;
        height: 100px;
        background: rgba(255, 82, 82, 0.05);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 40px rgba(255, 82, 82, 0.1);
    }
</style>
