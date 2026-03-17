<script lang="ts">
  import { onMount } from "svelte";
  import { storageService, notificationService } from "@yph/core";
  import { CollapsibleSidebar } from "@yph/ui-kit";
  import { viewMode } from "../stores/view-mode";
  import { themeChoice } from "../stores/theme.store";
  import {
    PlaylistPlayIcon,
    PlaylistPlusIcon,
    SaveIcon,
    PencilIcon,
    SearchIcon,
    Filter,
    InfoIcon
  } from "@yph/ui-kit";

  let collapsed = false;

  onMount(async () => {
    collapsed = await storageService.fetchObject("sidebar_collapsed", false);
  });

  async function handleToggle(event: CustomEvent<boolean>) {
      collapsed = event.detail;
      await storageService.storeObject("sidebar_collapsed", collapsed);
  }

  async function resetToDefaults(e: MouseEvent) {
      e.preventDefault();
      if (confirm("Reset all settings, view modes, and themes to factory defaults?")) {
          await storageService.storeObject("viewMode", "simple");
          await storageService.storeObject("theme-choice", "device");
          await storageService.storeObject("sidebar_collapsed", false);
          await storageService.storeObject("experimental_features", false);
          await storageService.storeObject("playlists-sorting", "date-created-desc");
          notificationService.success("Settings reset. Reloading...");
          setTimeout(() => window.location.reload(), 1000);
      }
  }

  function isActive(...pages: string[]) {
    return pages.some(
      (page) =>
        location.href.endsWith(page) || location.href.endsWith(page + "/")
    );
  }
</script>

<CollapsibleSidebar bind:collapsed on:toggle={handleToggle}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="logo" on:contextmenu={resetToDefaults} on:auxclick={resetToDefaults} title="Right-click to Reset Defaults">YPH</div>
  <nav>
    <a href="#/saved" class:active={isActive("saved")} title="Saved playlists">
        <PlaylistPlayIcon size="20" /> {#if !collapsed}<span>Saved playlists</span>{/if}
    </a>
    <a href="#/new" class:active={isActive("new")} title="New playlist">
        <PlaylistPlusIcon size="20" /> {#if !collapsed}<span>New playlist</span>{/if}
    </a>
    <a href="#/manage" class:active={isActive("manage")} title="Manage">
        <Filter size="20" /> {#if !collapsed}<span>Manage</span>{/if}
    </a>
    <a href="#/sync" class:active={isActive("sync")} title="Cloud Sync">
        <SaveIcon size="20" /> {#if !collapsed}<span>Cloud Sync</span>{/if}
    </a>
    <a href="#/compare" class:active={isActive("compare")} title="Merge Tool">
        <SearchIcon size="20" /> {#if !collapsed}<span>Merge Tool</span>{/if}
    </a>
    <a href="#/support" class:active={isActive("support")} title="Support">
        <InfoIcon size="20" /> {#if !collapsed}<span>Support</span>{/if}
    </a>
  </nav>

  {#if !collapsed}
    <div class="sidebar-footer">
      <div class="theme-selector">
          <p class="section-label">THEME</p>
          <select bind:value={$themeChoice} class="theme-select">
              <option value="device">Device Default</option>
              <option value="github-light">GitHub Light</option>
              <option value="github-dark">GitHub Dark</option>
              <option value="dracula">Dracula</option>
              <option value="sota-red">SOTA Red</option>
          </select>
      </div>

      <div class="quick-actions">
          <p class="section-label">QUICK ACTIONS</p>
          <a href="#/new" class="quick-link">
              <PencilIcon size="14" /> <span>Quick Builder</span>
          </a>
      </div>
      <button on:click={viewMode.toggle} class="view-mode-btn">
        Switch to {$viewMode === "simple" ? "Advanced" : "Simple"} Mode
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
      font-family: 'JetBrains Mono', monospace;
      cursor: help;
      user-select: none;
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
    font-size: 1rem;
    color: var(--sidebar-text-color);
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s;
  }

  a:hover {
    background-color: var(--hover-color);
    border-radius: 0.5rem;
  }

  a.active {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
    font-weight: bold;
    border-radius: 0.5rem;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-label {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
      font-weight: bold;
  }

  .theme-select {
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.8rem;
  }

  .quick-link {
      padding: 0.5rem;
      font-size: 0.85rem;
      opacity: 0.8;
      border: 1px dashed rgba(255, 255, 255, 0.2);
      border-radius: 0.3rem;
  }

  .quick-link:hover {
      opacity: 1;
      border-color: rgba(255, 255, 255, 0.5);
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
    transition: background 0.2s;
  }

  .view-mode-btn:hover {
      background: rgba(255, 255, 255, 0.25);
  }
</style>
