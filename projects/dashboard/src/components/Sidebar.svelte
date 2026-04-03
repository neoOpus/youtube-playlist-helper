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
    { id: "/", label: "Saved playlists", icon: PlaylistPlayIcon as any, color: "var(--primary)" },
    { id: "/new", label: "New playlist", icon: PlaylistPlusIcon as any, color: "var(--primary)" },
    { id: "/manage", label: "Manage Hub", icon: SaveIcon as any, color: "var(--primary)" },
    { id: "/sync", label: "Cloud Sync", icon: CloudSyncIcon as any, color: "var(--primary)" },
    { id: "/merge", label: "Merge Tool", icon: MergeIcon as any, color: "var(--primary)" },
    { id: "/support", label: "Support", icon: SupportIcon as any, color: "var(--primary)" },
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

<nav class="sidebar pro-glass" in:fly={{ x: -20, duration: 600 }}>
  <div class="sidebar-header">
    <div class="logo-area">
        <div class="logo-icon"><PlaylistPlayIcon size="24" /></div>
        <h1 class="logo-text">YPH <span class="badge primary">PRO</span></h1>
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
        aria-current={activeRoute === item.id ? 'page' : undefined}
      >
        <div class="icon-wrapper" style="--icon-color: ${item.color}">
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
        <span>/ for Search</span>
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
        <button class="view-toggle-btn" on:click={viewMode.toggle}>
            {$viewMode === 'simple' ? 'Advanced' : 'Simple'} View
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
    padding: var(--space-6) var(--space-4);
    border-right: 1px solid var(--border);
    position: relative;
    z-index: 20;
    color: var(--text);
    background: var(--card-bg-alpha);
    border-radius: 0; /* Sidebar should span full height */
  }

  .sidebar-header {
    padding: var(--space-2) var(--space-3) var(--space-8);
  }

  .logo-area {
      display: flex;
      align-items: center;
      gap: var(--space-3);
  }

  .logo-icon {
      background: var(--primary);
      color: white;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.4);
  }

  .logo-text {
      font-size: var(--font-xl);
      font-weight: 900;
      letter-spacing: -0.05em;
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--space-2);
  }

  .nav-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .section-label {
      font-size: var(--font-xs);
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 0.1em;
      padding-left: var(--space-3);
      margin-bottom: var(--space-2);
      text-transform: uppercase;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border: none;
    background: transparent;
    color: var(--text);
    font-size: var(--font-sm);
    font-weight: 700;
    cursor: pointer;
    border-radius: var(--radius-lg);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    text-align: left;
    overflow: hidden;
  }

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
      transition: all 0.2s;
  }

  .nav-item.active .icon-wrapper {
      filter: drop-shadow(0 0 8px var(--primary));
      transform: scale(1.1);
  }

  .active-indicator {
      position: absolute;
      left: 0;
      top: 25%;
      bottom: 25%;
      width: 4px;
      background: var(--primary);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      box-shadow: 0 0 10px var(--primary);
  }

  .spacer { flex-grow: 1; }

  .sidebar-footer {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding: var(--space-6) var(--space-3) 0;
    border-top: 1px solid var(--border);
  }

  .palette-hint {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--hover);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--font-xs);
      font-weight: 700;
      color: var(--text-muted);
      border: 1px solid var(--border);
  }

  .theme-select {
    width: 100%;
    padding: var(--space-2);
    border-radius: var(--radius-md);
    background: var(--hover);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: var(--font-xs);
    font-weight: 700;
    cursor: pointer;
    outline: none;
  }

  .view-toggle-btn {
      width: 100%;
      padding: var(--space-2);
      font-size: var(--font-xs);
      font-weight: 800;
      background: var(--hover);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.2s;
  }

  .view-toggle-btn:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
  }

  @media (max-width: 768px) {
    .label, .section-label, .logo-text, .palette-hint, .theme-controls, .quick-actions {
      display: none;
    }
    .sidebar {
      padding: var(--space-4) var(--space-2);
      width: var(--sidebar-collapsed-width);
    }
    .nav-item {
      justify-content: center;
      padding: var(--space-3);
    }
    .logo-area {
        justify-content: center;
    }
  }
</style>
