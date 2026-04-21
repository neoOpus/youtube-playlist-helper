<svelte:options runes={true} />
<script lang="ts">
  interface Props {
    size?: string | number;
    color?: string;
    class?: string;
  }
  let { size = "24", color = "currentColor", class: className = "" }: Props = $props();
</script>
