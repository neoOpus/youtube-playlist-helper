<script lang="ts">
  import { push } from "svelte-spa-router";
  import { fade, fly, slide } from "svelte/transition";
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
    { id: "/", label: "Saved infrastructure", icon: PlaylistPlayIcon as any, color: "var(--primary)" },
    { id: "/new", label: "New deployment", icon: PlaylistPlusIcon as any, color: "var(--primary)" },
    { id: "/manage", label: "Control Center", icon: SaveIcon as any, color: "var(--primary)" },
    { id: "/sync", label: "Global Sync", icon: CloudSyncIcon as any, color: "var(--primary)" },
    { id: "/merge", label: "Collision Tool", icon: MergeIcon as any, color: "var(--primary)" },
    { id: "/support", label: "Operational Support", icon: SupportIcon as any, color: "var(--primary)" },
  ];

  let systemSettingsExpanded = true;

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

<nav class="sidebar pro-glass" in:fly={{ x: -40, duration: 800, easing: (t) => t * (2 - t) }}>
  <div class="sidebar-header">
    <div class="logo-area aura-glow">
        <div class="logo-icon"><PlaylistPlayIcon size="24" /></div>
        <h1 class="logo-text">YPH <span class="badge primary">Pro</span></h1>
    </div>
  </div>

  <div class="nav-section">
    <p class="section-label">INFRASTRUCTURE</p>
    {#each navItems as item}
      <button
        class="nav-item luminous-hover"
        class:active={activeRoute === item.id}
        on:click={() => navigate(item.id)}
        on:mousemove={handleMouseMove}
        aria-current={activeRoute === item.id ? 'page' : undefined}
      >
        <div class="icon-wrapper">
            <svelte:component this={item.icon} size="20" />
        </div>
        <span class="label">{item.label}</span>
        {#if activeRoute === item.id}
            <div class="active-indicator" in:fade={{ duration: 300 }}></div>
        {/if}
      </button>
    {/each}
  </div>

  <div class="spacer"></div>

  <div class="sidebar-footer">
    <div class="palette-hint luminous-hover" role="status" on:mousemove={handleMouseMove}>
        <TerminalIcon size="12" />
        <span>Press / to Index</span>
    </div>

    <div class="collapsible-section">
        <button class="section-toggle" on:click={() => systemSettingsExpanded = !systemSettingsExpanded}>
            <span class="section-label">SYSTEM ARCHITECT</span>
            <span class="chevron" class:expanded={systemSettingsExpanded}>▼</span>
        </button>

        {#if systemSettingsExpanded}
          <div transition:slide>
            <div class="theme-controls">
                <div class="select-wrapper">
                    <select bind:value={$activeTheme} class="theme-select">
                      {#each themes as theme}
                        <option value={theme.id}>{theme.name}</option>
                      {/each}
                    </select>
                </div>
            </div>

            <div class="quick-actions mt-4">
                <button class="view-toggle-btn" on:click={viewMode.toggle}>
                    {$viewMode === 'simple' ? 'ADVANCED CORE' : 'SIMPLE CORE'}
                </button>
            </div>
          </div>
        {/if}
    </div>

    <div class="footer-meta">
        <span class="small muted">v1.2.4-Professional</span>
    </div>
  </div>
</nav>

<style>
  .sidebar {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--space-8) var(--space-4);
    border-right: 1px solid var(--border);
    position: relative;
    z-index: 20;
    color: var(--text);
    background: var(--card-bg-alpha);
    border-radius: 0;
  }

  .sidebar-header {
    padding: var(--space-2) var(--space-4) var(--space-12);
  }

  .logo-area {
      display: flex;
      align-items: center;
      gap: var(--space-4);
  }

  .logo-icon {
      background: var(--primary);
      color: white;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      box-shadow: 0 8px 24px rgba(var(--primary-rgb), 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .logo-text {
      font-size: var(--font-xl);
      font-weight: 900;
      letter-spacing: -0.06em;
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text);
  }

  .nav-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .section-label {
      font-size: 0.65rem;
      font-weight: 900;
      color: var(--text-muted);
      letter-spacing: 0.15em;
      padding-left: var(--space-4);
      margin-bottom: var(--space-3);
      text-transform: uppercase;
      opacity: 0.6;
      flex-grow: 1;
      text-align: left;
  }

  .section-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--space-2) 0;
  }

  .chevron {
      font-size: 8px;
      color: var(--text-muted);
      transition: transform 0.3s;
  }

  .chevron.expanded { transform: rotate(180deg); }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4) var(--space-5);
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: var(--font-sm);
    font-weight: 700;
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all 0.3s var(--easing-standard);
    position: relative;
    text-align: left;
    overflow: hidden;
  }

  .nav-item:hover {
    background: var(--hover);
    color: var(--text);
    transform: translateX(6px);
  }

  .nav-item.active {
    background: var(--hover);
    color: var(--primary);
    box-shadow: inset 4px 0 0 var(--primary);
  }

  .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      transition: transform 0.3s;
  }

  .nav-item.active .icon-wrapper {
      filter: drop-shadow(0 0 12px var(--primary));
      transform: scale(1.1);
  }

  .active-indicator {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background: var(--primary);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--primary);
  }

  .spacer { flex-grow: 1; }

  .sidebar-footer {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding: var(--space-8) var(--space-3) 0;
    border-top: 1px solid var(--border);
  }

  .palette-hint {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      background: var(--bg-secondary);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--font-xs);
      font-weight: 800;
      color: var(--text-muted);
      border: 1px solid var(--border);
      cursor: help;
  }

  .theme-select {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: var(--font-xs);
    font-weight: 800;
    cursor: pointer;
    outline: none;
    appearance: none;
  }

  .select-wrapper { position: relative; }
  .select-wrapper::after {
      content: '▼';
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 8px;
      pointer-events: none;
      opacity: 0.5;
  }

  .view-toggle-btn {
      width: 100%;
      padding: var(--space-3);
      font-size: 0.65rem;
      font-weight: 900;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.2s;
      letter-spacing: 0.05em;
  }

  .view-toggle-btn:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
  }

  .footer-meta {
      text-align: center;
      opacity: 0.5;
  }

  .mt-4 { margin-top: var(--space-4); }

  @media (max-width: 768px) {
    .label, .logo-text, .palette-hint, .collapsible-section, .footer-meta {
      display: none;
    }
    .sidebar {
      padding: var(--space-8) var(--space-2);
      width: 60px;
    }
    .nav-item {
      justify-content: center;
      padding: var(--space-4);
    }
    .logo-area {
        justify-content: center;
    }
    .section-label { display: none; }
  }
</style>
