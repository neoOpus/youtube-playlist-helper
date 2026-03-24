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
    Database
  } from "lucide-svelte";
  import { themeState, themes, setTheme } from "../stores/theme.svelte";
  import { router } from "../stores/router";

  let { activeRoute } = $props<{ activeRoute: string }>();
  let systemSettingsExpanded = $state(true);

  function isActive(path: string) {
    return activeRoute === path;
  }
</script>

<aside class="pro-sidebar">
  <div class="sidebar-header">
    <div class="logo-area">
      <Shield size="24" color="var(--primary)" />
      <span class="logo-text">YPH PRO</span>
    </div>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-section">
      <span class="section-label">Main Navigation</span>
      <button
        class="nav-item"
        class:active={isActive("/")}
        onclick={() => router.push("/")}
      >
        <LayoutDashboard size="20" />
        <span class="nav-text">Saved Collection</span>
      </button>

      <button
        class="nav-item"
        class:active={isActive("/new")}
        onclick={() => router.push("/new")}
      >
        <PlusCircle size="20" />
        <span class="nav-text">New Intelligence</span>
      </button>
    </div>

    <div class="nav-section">
      <span class="section-label">Infrastructure</span>
      <button
        class="nav-item"
        class:active={isActive("/manage")}
        onclick={() => router.push("/manage")}
      >
        <Database size="20" />
        <span class="nav-text">Manage Hub</span>
      </button>

      <button
        class="nav-item"
        class:active={isActive("/sync")}
        onclick={() => router.push("/sync")}
      >
        <RefreshCw size="20" />
        <span class="nav-text">Cloud Node</span>
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
        <div class="nav-group-content">
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
    <button
      class="nav-item support-btn"
      class:active={isActive("/support")}
      onclick={() => router.push("/support")}
    >
      <MessageSquare size="20" />
      <span class="nav-text">Security Protocol</span>
    </button>
  </div>
</aside>

<style>
  .pro-sidebar {
    height: 100%;
    background: rgba(15, 15, 15, 0.85);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    color: var(--text-muted);
  }

  .sidebar-header {
    padding: 2rem 1.5rem;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .sidebar-nav {
    flex: 1;
    padding: 0 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .nav-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .section-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-dim);
    padding: 0 0.75rem 0.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: left;
    width: 100%;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text);
  }

  .nav-item.active {
    background: rgba(255, 82, 82, 0.1);
    color: var(--primary);
  }

  .nav-text {
    font-size: 0.9rem;
    font-weight: 500;
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
  }

  .trigger-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .nav-group-content {
    margin-left: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-sub-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    color: var(--text-dim);
  }

  .sub-controls {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
  }

  .small-label {
    font-size: 0.75rem;
    font-weight: 500;
  }

  .theme-select {
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text);
    padding: 0.35rem;
    border-radius: 4px;
    font-size: 0.8rem;
    outline: none;
  }

  .sidebar-footer {
    padding: 1.5rem 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .support-btn {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .nav-text, .section-label, .sidebar-header .logo-text, .nav-group-trigger .lucide-chevron-down, .nav-group-trigger .lucide-chevron-right, .nav-group-content {
      display: none;
    }
    .pro-sidebar {
      width: 60px;
    }
    .logo-area {
        justify-content: center;
    }
    .nav-item {
        justify-content: center;
    }
  }
</style>
