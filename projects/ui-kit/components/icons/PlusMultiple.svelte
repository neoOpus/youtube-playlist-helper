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
  <line x1="12" y1="5" x2="12" y2="19"></line>
  <line x1="5" y1="12" x2="19" y2="12"></line>
</svg>
