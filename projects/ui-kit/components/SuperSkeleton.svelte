<script lang="ts">
  interface Props {
    width?: string;
    height?: string;
    radius?: string;
    class?: string;
  }

  let {
    width = '100%',
    height = '20px',
    radius = 'var(--radius-sm)',
    class: className = ''
  }: Props = $props();
</script>

<div
  class="sota-skeleton {className}"
  style="width: {width}; height: {height}; border-radius: {radius};"
></div>

<style>
  .sota-skeleton {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 25%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.03) 75%
    );
    background-size: 200% 100%;
    animation: sota-shimmer 2s infinite linear;
    border: 1px solid var(--border-subtle);
  }

  @keyframes sota-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
