<script lang="ts">
  import { scale } from "svelte/transition";

  export let items: { label: string; href?: string; active?: boolean }[] = [];
</script>

<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    {#each items as item, i}
      <li in:scale={{ start: 0.95, delay: i * 50 }}>
        {#if item.active}
          <span class="breadcrumb-item active" aria-current="page">{item.label}</span>
        {:else if item.href}
          <a href={item.href} class="breadcrumb-item link">{item.label}</a>
          <span class="separator">/</span>
        {:else}
          <span class="breadcrumb-item">{item.label}</span>
          <span class="separator">/</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  .breadcrumbs ol {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: var(--space-2);
    align-items: center;
  }

  .breadcrumb-item {
    font-size: var(--font-xs);
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: all 0.2s;
  }

  .breadcrumb-item.active {
    color: var(--primary);
  }

  .breadcrumb-item.link:hover {
    color: var(--text);
    text-decoration: underline;
  }

  .separator {
    color: var(--border-strong);
    font-size: var(--font-xs);
    margin-left: var(--space-2);
    font-weight: 900;
  }
</style>
