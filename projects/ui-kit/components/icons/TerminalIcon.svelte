<svelte:options runes={true} />
<script lang="ts">
  interface Props {
    size?: string | number;
    color?: string;
    class?: string;
  }
  let { size = "24", color = "currentColor", class: className = "" }: Props = $props();
</script>

<svg class={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="4 17 10 11 4 5"></polyline>
  <line x1="12" y1="19" x2="20" y2="19"></line>
</svg>
