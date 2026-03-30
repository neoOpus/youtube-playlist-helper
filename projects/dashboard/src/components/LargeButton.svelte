<svelte:options runes={true} />
<script lang="ts">
  interface Props {
    bgcolor?: string;
    children?: import("svelte").Snippet;
    [key: string]: any;
  }

  let { bgcolor = "#007bff", children, ...props }: Props = $props();
</script>
<button style="background-color: {bgcolor}" {...props}>
  {@render children?.()}
</button>
