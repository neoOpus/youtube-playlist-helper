<script lang="ts">
  import Skeleton from "./Skeleton.svelte";
</script>

<div class="card-skeleton pro-glass">
    <div class="header">
        <Skeleton width="48px" height="48px" radius="var(--radius-md)" />
        <div class="meta">
            <Skeleton width="60px" height="18px" />
            <Skeleton width="40px" height="12px" />
        </div>
    </div>
    <div class="body mt-6">
        <Skeleton width="80%" height="24px" />
        <div class="tags mt-4">
            <Skeleton width="40px" height="16px" />
            <Skeleton width="50px" height="16px" />
        </div>
    </div>
    <div class="footer mt-8">
        <div class="btns">
            <Skeleton width="32px" height="32px" />
            <Skeleton width="32px" height="32px" />
        </div>
        <Skeleton width="60px" height="12px" />
    </div>
</div>

<style>
    .card-skeleton { padding: var(--space-6); height: 240px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; }
    .meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .tags { display: flex; gap: 8px; }
    .footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: var(--space-4); }
    .btns { display: flex; gap: 8px; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
</style>
