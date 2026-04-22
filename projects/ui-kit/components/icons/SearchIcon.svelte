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
  <circle cx="11" cy="11" r="8"></circle>
  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
