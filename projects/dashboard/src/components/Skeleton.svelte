<svelte:options runes={true} />
<script lang="ts">
  let { width = "100%", height = "1rem", borderRadius = "4px", className = "" } = $props();
</script>

<div
    class="pro-skeleton {className}"
    style:width={width}
    style:height={height}
    style:border-radius={borderRadius}
></div>

<style>
    .pro-skeleton {
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03) 25%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
    }

    @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
</style>
