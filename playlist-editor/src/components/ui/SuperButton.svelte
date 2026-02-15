<script lang="ts">
  import SmartElement from "./SmartElement.svelte";

  export let title = "";
  export let bgcolor = "#007bff";
  export let disabled = false;
  export let loading = false;
  export let className = "";
  export let circle = false;
  export let tooltip = title;
  export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  $: computedBg = variant === 'danger' ? '#dc3545' :
                  variant === 'secondary' ? '#6c757d' :
                  variant === 'ghost' ? 'transparent' : bgcolor;
</script>

<SmartElement
  className="super-button ${className} ${circle ? 'is-circle' : ''} variant-${variant}"
  {disabled}
  {loading}
  {tooltip}
  style="background-color: ${computedBg}"
  on:click
>
  <slot />
</SmartElement>

<style>
  :global(.super-button) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  :global(.super-button.is-circle) {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    padding: 0;
  }

  :global(.super-button.variant-ghost) {
      color: inherit;
      box-shadow: none;
  }

  :global(.super-button.variant-ghost:hover) {
      background-color: rgba(0,0,0,0.05) !important;
  }

  :global(.super-button:hover) {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    filter: brightness(1.1);
  }

  :global(.super-button:active) {
    transform: scale(0.96);
  }
</style>
