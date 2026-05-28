<script lang="ts">
  let { width = "100%", height = "1rem", radius = "var(--radius-sm)" } = $props();
</script>

<div class="skeleton" style="width: {width}; height: {height}; border-radius: {radius};">
    <div class="shimmer"></div>
</div>

<style>
    .skeleton {
        background: var(--bg-tertiary);
        overflow: hidden;
        position: relative;
    }
    .shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 100%
        );
        animation: shimmer 2s infinite;
        transform: translateX(-100%);
    }
    @keyframes shimmer {
        100% { transform: translateX(100%); }
    }
</style>
