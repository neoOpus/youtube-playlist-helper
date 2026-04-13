<svelte:options runes={true} />
<script lang="ts">
  import { SuperSkeleton } from "@yph/ui-kit";
</script>

<div class="manage-skeleton">
    <div class="stats-row">
        {#each Array(4) as _}
            <div class="stat-card pro-glass">
                <SuperSkeleton width="30%" height="12px" />
                <SuperSkeleton width="60%" height="32px" className="mt-2" />
            </div>
        {/each}
    </div>

    <div class="main-content mt-12">
        <div class="section pro-glass">
            <SuperSkeleton width="20%" height="24px" />
            <div class="controls mt-6">
                <SuperSkeleton width="100%" height="48px" radius="12px" />
                <SuperSkeleton width="100%" height="48px" radius="12px" />
                <SuperSkeleton width="100%" height="48px" radius="12px" />
            </div>
        </div>

        <div class="side-panel">
            <div class="pro-glass p-6">
                <SuperSkeleton width="40%" height="20px" />
                <SuperSkeleton width="100%" height="100px" radius="12px" className="mt-4" />
                <SuperSkeleton width="100%" height="100px" radius="12px" className="mt-4" />
            </div>
        </div>
    </div>
</div>

<style>
    .manage-skeleton { padding: 2rem; }
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .stat-card { padding: 1.5rem; border-radius: var(--radius-xl); }
    .main-content { display: grid; grid-template-columns: 1fr 350px; gap: 2rem; }
    .section { padding: 2rem; border-radius: var(--radius-2xl); }
    .controls { display: flex; flex-direction: column; gap: 1rem; }
    .side-panel { display: flex; flex-direction: column; gap: 1.5rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-12 { margin-top: 3rem; }
    .p-6 { padding: 1.5rem; }
</style>
