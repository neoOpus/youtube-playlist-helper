<svelte:options runes={true} />
<script lang="ts">
  import {
    LayoutDashboard,
    PlusCircle,
    Settings,
    MessageSquare,
    ChevronDown,
    ChevronRight,
    Monitor,
    Shield,
    RefreshCw,
    Database,
    Terminal,
    Merge,
    Layers
  } from "lucide-svelte";
  import { themeState, themes, setTheme } from "../stores/theme.svelte";
  import { router } from "../stores/router";
  import { fly } from "svelte/transition";

  let { activeRoute } = $props<{ activeRoute: string }>();
  let systemSettingsExpanded = $state(true);

  function isActive(path: string) {
    return activeRoute === path;
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

<aside class="pro-sidebar pro-glass" in:fly={{ x: -20, duration: 600 }}>
  <div class="sidebar-header">
    <div class="logo-area">
      <div class="logo-icon"><Shield size="24" /></div>
      <span class="logo-text">YPH <span class="badge primary">PRO</span></span>
    </div>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-section">
      <span class="section-label">Main Navigation</span>
      <button
        class="nav-item luminous-hover"
        class:active={isActive("/")}
        onclick={() => router.push("/")}
        onmousemove={handleMouseMove}
        aria-current={isActive("/") ? 'page' : undefined}
      >
        <div class="icon-wrapper"><LayoutDashboard size="20" /></div>
        <span class="nav-text">Saved Collection</span>
        {#if isActive("/")}<div class="active-indicator"></div>{/if}
      </button>

      <button
        class="nav-item luminous-hover"
        class:active={isActive("/new")}
        onclick={() => router.push("/new")}
        onmousemove={handleMouseMove}
        aria-current={isActive("/new") ? 'page' : undefined}
      >
        <div class="icon-wrapper"><PlusCircle size="20" /></div>
        <span class="nav-text">New Intelligence</span>
        {#if isActive("/new")}<div class="active-indicator"></div>{/if}
      </button>
    </div>

    <div class="nav-section">
      <span class="section-label">Infrastructure</span>
      <button
        class="nav-item luminous-hover"
        class:active={isActive("/manage")}
        onclick={() => router.push("/manage")}
        onmousemove={handleMouseMove}
        aria-current={isActive("/manage") ? 'page' : undefined}
      >
        <div class="icon-wrapper"><Database size="20" /></div>
        <span class="nav-text">Manage Hub</span>
        {#if isActive("/manage")}<div class="active-indicator"></div>{/if}
      </button>

      <button
        class="nav-item luminous-hover"
        class:active={isActive("/sync")}
        onclick={() => router.push("/sync")}
        onmousemove={handleMouseMove}
        aria-current={isActive("/sync") ? 'page' : undefined}
      >
        <div class="icon-wrapper"><RefreshCw size="20" /></div>
        <span class="nav-text">Cloud Node</span>
        {#if isActive("/sync")}<div class="active-indicator"></div>{/if}
      </button>

      <button
        class="nav-item luminous-hover"
        class:active={isActive("/merge")}
        onclick={() => router.push("/merge")}
        onmousemove={handleMouseMove}
        aria-current={isActive("/merge") ? 'page' : undefined}
      >
        <div class="icon-wrapper"><Merge size="20" /></div>
        <span class="nav-text">Merge Protocol</span>
        {#if isActive("/merge")}<div class="active-indicator"></div>{/if}
      </button>
    </div>

    <div class="nav-section">
      <button class="nav-group-trigger" onclick={() => systemSettingsExpanded = !systemSettingsExpanded}>
        <div class="trigger-label">
            <Settings size="20" />
            <span class="nav-text">System Environment</span>
        </div>
        {#if systemSettingsExpanded}
            <ChevronDown size="16" />
        {:else}
            <ChevronRight size="16" />
        {/if}
      </button>

      {#if systemSettingsExpanded}
        <div class="nav-group-content" in:fly={{ y: -5, duration: 200 }}>
            <div class="nav-sub-item">
                <Monitor size="16" />
                <div class="sub-controls">
                    <span class="small-label">Theme Engine</span>
                    <select value={themeState.choice} onchange={(e) => setTheme(e.currentTarget.value as any)} class="theme-select">
                        {#each themes as theme}
                            <option value={theme.id}>{theme.name}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>
      {/if}
    </div>
  </nav>

  <div class="sidebar-footer">
    <div class="palette-hint">
        <Terminal size="12" />
        <span>/ for Search</span>
    </div>

    <button
      class="nav-item support-btn luminous-hover"
      class:active={isActive("/support")}
      onclick={() => router.push("/support")}
      onmousemove={handleMouseMove}
    >
      <MessageSquare size="20" />
      <span class="nav-text">Security Protocol</span>
    </button>
  </div>
</aside>

<style>
  .pro-sidebar {
    height: 100%;
    background: var(--card-bg-alpha);
    backdrop-filter: blur(20px);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    color: var(--text-muted);
    z-index: 20;
    width: var(--sidebar-width);
    transition: width var(--duration-standard) var(--easing-standard);
  }

  .sidebar-header {
    padding: 2rem 1.5rem;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
      background: var(--primary);
      color: white;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.05em;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .sidebar-nav {
    flex: 1;
    padding: 0 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-y: auto;
  }

  .nav-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .section-label {
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-dim);
    padding: 0 0.75rem 0.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: var(--radius-lg);
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    text-align: left;
    width: 100%;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text);
  }

  .nav-item.active {
    background: rgba(var(--primary-rgb), 0.1);
    color: var(--primary);
  }

  .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
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

  .nav-text {
    font-size: 0.9rem;
    font-weight: 700;
  }

  .nav-group-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    width: 100%;
    border-radius: var(--radius-md);
  }

  .nav-group-trigger:hover {
      background: rgba(255, 255, 255, 0.03);
  }

  .trigger-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .nav-group-content {
    margin-left: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-sub-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    color: var(--text-muted);
  }

  .sub-controls {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
  }

  .small-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .theme-select {
    width: 100%;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.4rem;
    border-radius: var(--radius-md);
    font-size: 0.8rem;
    font-weight: 700;
    outline: none;
    cursor: pointer;
  }

  .sidebar-footer {
    padding: 1.5rem 0.75rem;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
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

  .support-btn {
    opacity: 0.7;
  }

  .support-btn:hover { opacity: 1; }

  @media (max-width: 768px) {
    .pro-sidebar {
      width: var(--sidebar-collapsed-width);
    }
    .nav-text, .section-label, .sidebar-header .logo-text, .nav-group-trigger .lucide-chevron-down, .nav-group-trigger .lucide-chevron-right, .nav-group-content, .palette-hint {
      display: none;
    }
    .nav-item, .logo-area, .nav-group-trigger {
        justify-content: center;
        padding: 0.75rem;
    }
    .nav-section { gap: 0.5rem; }
  }
</style>
