<script lang="ts">
  import { onMount } from "svelte";
  import { storage } from "../../services/core/storage-service";
  import type { Settings, ViewMode } from "../../types/model";
  import { link, location } from "svelte-spa-router";
  import Fa from "svelte-fa";
  import {
    faPlus, faList, faStore, faHistory, faCog, faLifeRing, faGlobe, faExchangeAlt, faLayerGroup
  } from "@fortawesome/free-solid-svg-icons";

  let viewMode: ViewMode = "simple";
  onMount(async () => {
    const settings = await storage.getSettings();
    viewMode = settings.viewMode || "simple";
  });

  $: isActive = (path: string) => $location === path;
</script>

<aside class="sidebar">
  <nav>
    <div class="nav-group">
        <span class="nav-label">Management</span>
        <a href="/new" use:link class:active={isActive('/new')}>
          <Fa icon={faPlus} />
          <span>New Playlist</span>
        </a>
        <a href="/saved" use:link class:active={isActive('/saved')}>
          <Fa icon={faList} />
          <span>Saved Playlists</span>
        </a>
        <a href="/omni" use:link class:active={isActive('/omni')}>
        <a href="/marketplace" use:link class:active={isActive("/marketplace")}>
          <Fa icon={faStore} />
          <span>Marketplace</span>
        </a>
          <Fa icon={faGlobe} />
          <span>Omni View</span>
        </a>
    </div>

    <div class="nav-group">
        <span class="nav-label">Advanced Tools</span>
        <a href="/compare" use:link class:active={isActive('/compare')}>
          <Fa icon={faExchangeAlt} />
          <span>Multi-Orchestrator</span>
        </a>
        <a href="/playlist-builder" use:link class:active={isActive('/playlist-builder')}>
          <Fa icon={faHistory} />
          <span>Recent Builder</span>
        </a>
    </div>

    <div class="spacer"></div>

    <div class="nav-footer">
        <a href="/manage" use:link class:active={isActive('/manage')}>
          <Fa icon={faCog} />
          <span>Settings</span>
        </a>
        <a href="/support" use:link class:active={isActive('/support')}>
          <Fa icon={faLifeRing} />
          <span>Support</span>
        </a>
    </div>
  </nav>
</aside>

<style>
  .sidebar {
    width: 240px;
    height: 100vh;
    background-color: var(--sidebar-bg-color, #2c3e50);
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    padding-top: 60px; /* Header height */
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  }

  nav {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
  }

  .nav-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 2rem;
  }

  .nav-group .nav-label {
      font-size: 0.7rem;
      font-weight: bold;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      padding-left: 12px;
      margin-bottom: 8px;
  }

  a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    text-decoration: none;
    color: rgba(255,255,255,0.7);
    border-radius: 8px;
    transition: all 0.2s;
    font-size: 0.95rem;
  }

  a:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  a.active {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    font-weight: 600;
  }

  .spacer {
    flex-grow: 1;
  }

  .nav-footer {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 1rem;
      margin-bottom: 80px; /* Space for status bar + some padding */
  }
</style>
