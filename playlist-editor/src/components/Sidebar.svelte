<script lang="ts">
  import { onMount } from "svelte";
  import type { Settings, ViewMode } from "../types/model";

  let viewMode: ViewMode = "simple";

  onMount(async () => {
    const settings = await window.getSettings();
    viewMode = settings.viewMode || "simple";
  });

  async function toggleViewMode() {
    viewMode = viewMode === "simple" ? "advanced" : "simple";
    await window.storeObject("viewMode", viewMode);
    window.location.reload(); // Refresh to apply view mode changes
  }

  function isActive(...pages: string[]) {
    return pages.some(
      (page) =>
        location.href.endsWith(page) || location.href.endsWith(page + "/")
    );
  }
</script>

<div class="sidenav">
  <a href="#/saved" class:active={isActive("saved")}>Saved playlists</a>
  <a href="#/new" class:active={isActive("new")}>New playlist</a>
  <a href="#/manage" class:active={isActive("manage")}>Manage playlists</a>
  <a href="#/compare" class:active={isActive("compare")}>Merge Tool</a>
  <a href="#/support" class:active={isActive("support")}>Support</a>

  <div class="sidebar-footer">
    <button on:click={toggleViewMode} class="view-mode-btn">
      Switch to {viewMode === "simple" ? "Advanced" : "Simple"} Mode
    </button>
  </div>
</div>

<style>
  .sidenav {
    height: 100%;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: var(--sidebar-bg-color);
    padding: 1rem 0.2rem;
  }

  .sidenav a {
    padding: 1rem 0.5rem;
    margin-bottom: 0.2rem;
    text-decoration: none;
    font-size: 1.2rem;
    line-height: 1.2rem;
    color: var(--sidebar-text-color);
    display: block;
  }

  .sidenav a:hover {
    background-color: var(--hover-color);
  }

  .sidenav a.active {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
  }

  .sidenav a:hover,
  .sidenav a.active {
    border-radius: 0.5rem;
  }

  .sidebar-footer {
    position: absolute;
    bottom: 2rem;
    left: 0;
    width: 100%;
    padding: 0 0.5rem;
  }

  .view-mode-btn {
    width: 100%;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid white;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .view-mode-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
