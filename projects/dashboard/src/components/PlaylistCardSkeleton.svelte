<svelte:options runes={true} />
<script lang="ts">
  import { SuperSkeleton } from "@yph/ui-kit";
</script>

<div class="skeleton-card pro-glass">
    <div class="header">
        <SuperSkeleton width="40px" height="40px" radius="12px" />
        <div class="title-meta">
            <SuperSkeleton width="70%" height="18px" />
            <SuperSkeleton width="40%" height="12px" />
        </div>
    </div>

    <div class="preview-grid">
        <SuperSkeleton height="80px" radius="12px" />
        <SuperSkeleton height="80px" radius="12px" />
        <SuperSkeleton height="80px" radius="12px" />
    </div>

    <div class="footer">
        <SuperSkeleton width="30%" height="12px" />
        <div class="actions">
            <SuperSkeleton width="24px" height="24px" radius="50%" />
            <SuperSkeleton width="24px" height="24px" radius="50%" />
        </div>
    </div>
</div>

<style>
    .skeleton-card {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        border-radius: var(--radius-2xl);
    }

    .header {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .title-meta {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .preview-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
    }

    .actions {
        display: flex;
        gap: 0.75rem;
    }
</style>
