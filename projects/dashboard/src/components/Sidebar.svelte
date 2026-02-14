<script lang="ts">
  import { onMount } from "svelte";
  import type { ViewMode } from "@yph/core";
  import { storageService } from "@yph/core";
  import { CollapsibleSidebar } from "@yph/ui-kit";

  let viewMode: ViewMode = "simple";
  let collapsed = false;

  onMount(async () => {
    const settings = await storageService.getSettings();
    viewMode = settings.viewMode || "simple";
    collapsed = await storageService.fetchObject("sidebar_collapsed", false);
  });

  async function toggleViewMode() {
    viewMode = viewMode === "simple" ? "advanced" : "simple";
    await storageService.storeObject("viewMode", viewMode);
    window.location.reload();
  }

  async function handleToggle(event: CustomEvent<boolean>) {
      collapsed = event.detail;
      await storageService.storeObject("sidebar_collapsed", collapsed);
  }

  function isActive(...pages: string[]) {
    return pages.some(
      (page) =>
        location.href.endsWith(page) || location.href.endsWith(page + "/")
    );
  }
</script>

<CollapsibleSidebar bind:collapsed on:toggle={handleToggle}>
  <div class="logo">YPH</div>
  <nav>
    <a href="#/saved" class:active={isActive("saved")} title="Saved playlists">
        <span>📁</span> {#if !collapsed}<span>Saved playlists</span>{/if}
    </a>
    <a href="#/new" class:active={isActive("new")} title="New playlist">
        <span>➕</span> {#if !collapsed}<span>New playlist</span>{/if}
    </a>
    <a href="#/manage" class:active={isActive("manage")} title="Manage">
    <a href="#/sync" class:active={isActive("sync")} title="Cloud Sync">
        <span>☁️</span> {#if !collapsed}<span>Cloud Sync</span>{/if}
    </a>
        <span>⚙️</span> {#if !collapsed}<span>Manage</span>{/if}
    </a>
    <a href="#/compare" class:active={isActive("compare")} title="Merge Tool">
        <span>↔️</span> {#if !collapsed}<span>Merge Tool</span>{/if}
    </a>
    <a href="#/support" class:active={isActive("support")} title="Support">
        <span>❤️</span> {#if !collapsed}<span>Support</span>{/if}
    </a>
  </nav>

  {#if !collapsed}
    <div class="sidebar-footer">
      <button on:click={toggleViewMode} class="view-mode-btn">
        Switch to {viewMode === "simple" ? "Advanced" : "Simple"} Mode
      </button>
    </div>
  {/if}
</CollapsibleSidebar>

<style>
  .logo {
      color: white;
      font-weight: bold;
      font-size: 1.4rem;
      padding: 1rem 0.5rem 2rem;
      text-align: center;
  }

  nav {
      display: flex;
      flex-direction: column;
      padding: 0 0.5rem;
  }

  a {
    padding: 0.8rem 1rem;
    margin-bottom: 0.4rem;
    text-decoration: none;
    font-size: 1.1rem;
    color: var(--sidebar-text-color);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.2s;
  }

  a:hover {
    background-color: var(--hover-color);
  }

  a.active {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
    font-weight: bold;
  }

  a:hover,
  a.active {
    border-radius: 0.5rem;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 2rem 1rem;
  }

  .view-mode-btn {
    width: 100%;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.6rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.85rem;
  }
</style>
