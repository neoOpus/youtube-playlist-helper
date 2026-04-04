<svelte:options runes={true} />
<script lang="ts">
  import Skeleton from "./Skeleton.svelte";
</script>

<div class="skeleton-card pro-glass p-6">
    <div class="card-head">
        <Skeleton width="48px" height="48px" borderRadius="12px" />
        <div class="meta">
            <Skeleton width="180px" height="1.2rem" />
            <Skeleton width="100px" height="0.8rem" className="mt-2" />
        </div>
    </div>
    <div class="card-body mt-6">
        <div class="stats">
            <Skeleton width="60px" height="1.5rem" borderRadius="20px" />
            <Skeleton width="80px" height="1.5rem" borderRadius="20px" />
        </div>
        <div class="actions mt-6">
            <Skeleton width="100%" height="40px" borderRadius="8px" />
        </div>
    </div>
</div>

<style>
    .skeleton-card {
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .card-head {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    .meta {
        flex: 1;
    }
    .stats {
        display: flex;
        gap: 0.5rem;
    }
</style>
