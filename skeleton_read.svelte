<svelte:options runes={true} />
<script lang="ts">
  interface Props {
    width?: string;
    height?: string;
    radius?: string;
    animate?: boolean;
    className?: string;
  }

  let {
    width = '100%',
    height = '20px',
    radius = 'var(--radius-md)',
    animate = true,
    className = ''
  } = $props<Props>();
</script>

<div
  class="skeleton {className}"
  class:shimmer={animate}
  style:width
  style:height
  style:border-radius={radius}
  role="presentation"
  aria-hidden="true"
></div>

<style>
  .skeleton {
    background: var(--hover);
    position: relative;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.03),
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.03),
      transparent
    );
    animation: shimmer 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .shimmer::after {
      animation: none;
      background: rgba(255, 255, 255, 0.05);
      transform: none;
    }
  }
</style>
