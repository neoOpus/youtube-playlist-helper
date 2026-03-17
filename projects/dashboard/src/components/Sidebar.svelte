<script lang="ts">
  import { push } from "svelte-spa-router";
  import { fade, fly } from "svelte/transition";
  import {
    PlaylistPlusIcon,
    PlaylistPlayIcon,
    SaveIcon,
    CloudSyncIcon,
    MergeIcon,
    SupportIcon,
    TerminalIcon,
    type IconComponent
  } from "@yph/ui-kit";
  import { activeTheme, themes } from "../stores/theme.store";
  import { viewMode } from "../stores/view-mode";

  export let activeRoute = "/";

  interface NavItem {
      id: string;
      label: string;
      icon: IconComponent;
      color: string;
  }

  const navItems: NavItem[] = [
    { id: "/", label: "Saved playlists", icon: PlaylistPlayIcon as any, color: "#ff5252" },
    { id: "/new", label: "New playlist", icon: PlaylistPlusIcon as any, color: "#ff8a80" },
    { id: "/manage", label: "Manage Hub", icon: SaveIcon as any, color: "#ff1744" },
    { id: "/sync", label: "Cloud Sync", icon: CloudSyncIcon as any, color: "#b0bec5" },
    { id: "/merge", label: "Merge Tool", icon: MergeIcon as any, color: "#ff80ab" },
    { id: "/support", label: "Support", icon: SupportIcon as any, color: "#cfd8dc" },
  ];

  function navigate(id: string) {
    push(id);
  }

  function handleMouseMove(e: MouseEvent) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
  }
</script>

<nav class="sidebar glass pro-blur" in:fly={{ x: -20, duration: 600 }}>
  <div class="sidebar-header">
    <div class="logo-area">
        <div class="logo-icon"><PlaylistPlayIcon size="24" /></div>
        <h1 class="logo-text">YPH <span class="badge">PRO</span></h1>
    </div>
  </div>

  <div class="nav-section">
    <p class="section-label">NAVIGATE</p>
    {#each navItems as item}
      <button
        class="nav-item luminous-hover"
        class:active={activeRoute === item.id}
        on:click={() => navigate(item.id)}
        on:mousemove={handleMouseMove}
      >
        <div class="icon-wrapper" style="--icon-color: {item.color}">
            <svelte:component this={item.icon} size="20" />
        </div>
        <span class="label">{item.label}</span>
        {#if activeRoute === item.id}
            <div class="active-indicator" in:fade></div>
        {/if}
      </button>
    {/each}
  </div>

  <div class="spacer"></div>

  <div class="sidebar-footer">
    <div class="palette-hint">
        <TerminalIcon size="12" />
        <span>Ctrl + K for Commands</span>
    </div>

    <div class="theme-controls">
        <p class="section-label">THEME</p>
        <select bind:value={$activeTheme} class="theme-select">
          {#each themes as theme}
            <option value={theme.id}>{theme.name}</option>
          {/each}
        </select>
    </div>

    <div class="quick-actions">
        <button class="btn mini w-full" on:click={viewMode.toggle}>
            Switch to {$viewMode === 'simple' ? 'Advanced' : 'Simple'} View
        </button>
    </div>
  </div>
</nav>

<style>
  .sidebar {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1rem;
    border-right: 1px solid var(--border);
    position: relative;
    z-index: 20;
    color: var(--text);
    background: var(--sidebar-bg, rgba(10, 15, 25, 0.7));
  }

  .pro-blur { backdrop-filter: blur(24px); }

  .sidebar-header {
    padding: 0.5rem 0.75rem 2rem;
  }

  .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
  }

  .logo-icon {
      background: var(--primary);
      color: white;
      padding: 6px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(255, 82, 82, 0.4);
  }

  .logo-text {
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: -1px;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
  }

  .badge {
      font-size: 0.6rem;
      background: var(--primary);
      color: white;
      padding: 2px 5px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      font-weight: 800;
  }

  .nav-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-label {
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 1.5px;
      padding-left: 0.75rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    text-align: left;
    overflow: hidden;
  }

  .luminous-hover::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 82, 82, 0.15) 0%, transparent 60%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
  }
  .luminous-hover:hover::after { opacity: 1; }

  .nav-item:hover {
    background: var(--hover);
    transform: translateX(4px);
  }

  .nav-item.active {
    background: var(--hover);
    color: var(--primary);
  }

  .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--icon-color, var(--text-muted));
      transition: all 0.3s;
  }

  .nav-item.active .icon-wrapper {
      filter: drop-shadow(0 0 8px var(--icon-color));
      transform: scale(1.1);
  }

  .active-indicator {
      position: absolute;
      left: 0;
      top: 20%;
      bottom: 20%;
      width: 4px;
      background: var(--primary);
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 10px var(--primary);
  }

  .spacer { flex-grow: 1; }

  .sidebar-footer {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 0.75rem 0;
    border-top: 1px solid var(--border);
  }

  .palette-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--hover);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      border: 1px solid var(--border);
  }

  .theme-select {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    background: var(--hover);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    outline: none;
  }

  .btn.mini {
      padding: 8px;
      font-size: 0.75rem;
      font-weight: 800;
      background: var(--hover);
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.2s;
  }

  .btn.mini:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
  }

  .w-full { width: 100%; }

  @media (max-width: 768px) {
    .label, .section-label, .logo-text, .palette-hint, .theme-controls, .quick-actions {
      display: none;
    }
    .sidebar {
      padding: 1.5rem 0.5rem;
    }
    .nav-item {
      justify-content: center;
      padding: 14px;
    }
    .logo-area {
        justify-content: center;
    }
  }
</style>
