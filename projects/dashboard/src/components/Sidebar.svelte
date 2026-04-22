<svelte:options runes={true} />
<script lang="ts">
  import {
    Home,
    PlusCircle,
    Settings as SettingsIcon,
    Cloud,
    Shield,
    Zap,
    LayoutDashboard,
    HelpCircle,
    Activity
  } from "lucide-svelte";
  import { router } from "../stores/router";
  import { appState } from "../stores/theme.svelte";
  import SystemHealth from "./SystemHealth.svelte";

  let { activeRoute = "/" } = $props();

  function isActive(path: string) {
    if (path === "/" && activeRoute === "/") return true;
    if (path !== "/" && activeRoute.startsWith(path)) return true;
    return false;
  }
</script>

<aside class="sidebar surface-1">
  <div class="sidebar-header">
    <div class="logo" onclick={() => router.push("/")} aria-hidden="true">
      <div class="logo-mark"><Zap size="18" fill="currentColor" /></div>
      <span class="logo-text">YPH_PRO</span>
    </div>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-group">
      <span class="group-label">Library</span>
      <button class="nav-link" class:active={isActive("/")} onclick={() => router.push("/")}>
        <Home size="18" />
        <span class="link-text">Collections</span>
      </button>
      <button class="nav-link" class:active={isActive("/new")} onclick={() => router.push("/new")}>
        <PlusCircle size="18" />
        <span class="link-text">New Intake</span>
      </button>
    </div>

    <div class="nav-group">
      <span class="group-label">System</span>
      <button class="nav-link" class:active={isActive("/manage")} onclick={() => router.push("/manage")}>
        <SettingsIcon size="18" />
        <span class="link-text">Preferences</span>
      </button>
      <button class="nav-link" class:active={isActive("/sync")} onclick={() => router.push("/sync")}>
        <Cloud size="18" />
        <span class="link-text">Sync Node</span>
      </button>
      <button class="nav-link" class:active={isActive("/merge")} onclick={() => router.push("/merge")}>
        <Shield size="18" />
        <span class="link-text">Resolver</span>
      </button>
    </div>
  </nav>

  <div class="sidebar-health">
      <SystemHealth />
  </div>

  <div class="sidebar-footer">
    <button class="nav-link" class:active={isActive("/support")} onclick={() => router.push("/support")}>
      <HelpCircle size="18" />
      <span class="link-text">Support</span>
    </button>
  </div>
</aside>

<style>
  .sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 0;
    border-top: none;
    border-bottom: none;
  }

  .sidebar-header { padding: var(--space-8) var(--space-6); }
  .logo { display: flex; align-items: center; gap: var(--space-3); cursor: pointer; }
  .logo-mark { background: var(--primary); color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .logo-text { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.02em; color: var(--text-main); }

  .sidebar-nav { flex: 1; padding: 0 var(--space-3); display: flex; flex-direction: column; gap: var(--space-8); overflow-y: auto; }
  .nav-group { display: flex; flex-direction: column; gap: var(--space-1); }
  .group-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); padding: 0 var(--space-4) var(--space-2); }

  .nav-link {
    display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3) var(--space-4); border-radius: 8px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; transition: all var(--duration-fast) var(--ease-in-out); text-align: left; width: 100%; font-weight: 600; font-size: 0.9rem;
  }
  .nav-link:hover { background: var(--border-subtle); color: var(--text-main); }
  .nav-link.active { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); }

  .sidebar-health { padding: var(--space-4) var(--space-3); }

  .sidebar-footer { padding: var(--space-4) var(--space-3); border-top: 1px solid var(--border-base); }

  @media (max-width: 1000px) {
    .link-text, .group-label, .logo-text, .sidebar-health { display: none; }
    .nav-link, .logo { justify-content: center; padding: var(--space-4); }
  }
</style>
