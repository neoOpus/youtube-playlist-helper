<svelte:options runes={true} />
<script lang="ts">
  import SmartElement from "./SmartElement.svelte";

  interface Props {
    bgcolor?: string;
    className?: string;
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
    children?: import("svelte").Snippet;
    title?: string;
    ariaLabel?: string;
  }

  let {
    bgcolor = "",
    className = "",
    disabled = false,
    onclick,
    children,
    title,
    ariaLabel
  }: Props = $props();
</script>

<SmartElement
  className="simple-btn {className}"
  style="background-color: {bgcolor}"
  {disabled}
  {onclick}
  {title}
  {ariaLabel}
>
  {@render children?.()}
</SmartElement>

<style>
  :global(.simple-btn) {
    border: 1px solid var(--border);
    background: transparent;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--text);
    font-size: var(--font-sm);
    font-weight: 700;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-family: inherit;
    text-decoration: none;
    outline: none;
  }

  :global(.simple-btn:hover:not(:disabled)) {
    background: var(--hover);
    border-color: var(--text-muted);
    transform: translateY(-1px);
  }

  :global(.simple-btn:active:not(:disabled)) {
      transform: translateY(0);
  }

  :global(.simple-btn:focus-visible) {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  :global(.simple-btn:disabled) {
      opacity: 0.5;
      cursor: not-allowed;
  }
</style>
