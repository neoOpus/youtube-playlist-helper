<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import {
    Home,
    PlusCircle,
    Settings as SettingsIcon,
    Cloud,
    Shield,
    Zap,
    LayoutDashboard,
    HelpCircle,
    Activity,
    GraduationCap,
    BookOpen,
    Search,
    ChevronRight
  } from "lucide-svelte";
  import { router } from "../stores/router";
  import { appState } from "../stores/theme.svelte";
  import { storageService } from "@yph/core";
  import type { Playlist } from "@yph/core";
  import SystemHealth from "./SystemHealth.svelte";

  let { activeRoute = "/" } = $props();
  let curriculumPaths = $state<Playlist[]>([]);

  onMount(async () => {
    const playlists = await storageService.getPlaylists();
    curriculumPaths = playlists.filter(p => p.curriculum?.enabled);

    storageService.onSave(async (id) => {
        if (id.startsWith("playlist_")) {
            const updated = await storageService.getPlaylists();
            curriculumPaths = updated.filter(p => p.curriculum?.enabled);
        }
    });
  });

  function isActive(path: string) {
    if (path === "/" && activeRoute === "/") return true;
    if (path !== "/" && activeRoute.startsWith(path)) return true;
    return false;
  }
</script>

<aside class="sidebar surface-1">
  <div class="sidebar-header">
    <div class="logo" onclick={() => router.push("/")} aria-hidden="true">
      <div class="logo-mark"><Zap size={18} fill="currentColor" /></div>
      <span class="logo-text">YPH_PRO</span>
    </div>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-group">
      <span class="group-label">Library</span>
      <button class="nav-link" class:active={isActive("/")} onclick={() => router.push("/")}>
        <div class="link-icon"><Home size={18} /></div>
        <span class="link-text">Collections</span>
        {#if isActive("/")}<div class="active-indicator"></div>{/if}
      </button>
      <button class="nav-link" class:active={isActive("/new")} onclick={() => router.push("/new")}>
        <div class="link-icon"><PlusCircle size={18} /></div>
        <span class="link-text">New Intake</span>
        {#if isActive("/new")}<div class="active-indicator"></div>{/if}
      </button>
    </div>

    {#if curriculumPaths.length > 0}
        <div class="nav-group">
            <span class="group-label">Learning Paths</span>
            {#each curriculumPaths as path}
                <button
                    class="nav-link curriculum-link"
                    class:active={router.fullPath === `/path/${path.id}`}
                    onclick={() => router.push(`/path/${path.id}`)}
                >
                    <div class="link-icon"><BookOpen size={16} /></div>
                    <span class="link-text">{path.title}</span>
                    {#if router.fullPath === `/path/${path.id}`}<div class="active-indicator"></div>{/if}
                </button>
            {/each}
        </div>
    {/if}

    <div class="nav-group">
      <span class="group-label">System</span>
      <button class="nav-link" class:active={isActive("/manage")} onclick={() => router.push("/manage")}>
        <div class="link-icon"><SettingsIcon size={18} /></div>
        <span class="link-text">Preferences</span>
        {#if isActive("/manage")}<div class="active-indicator"></div>{/if}
      </button>
      <button class="nav-link" class:active={isActive("/sync")} onclick={() => router.push("/sync")}>
        <div class="link-icon"><Cloud size={18} /></div>
        <span class="link-text">Sync Node</span>
        {#if isActive("/sync")}<div class="active-indicator"></div>{/if}
      </button>
    </div>
  </nav>

  <div class="sidebar-health">
      <SystemHealth />
  </div>

  <div class="sidebar-footer">
    <button class="nav-link" class:active={isActive("/support")} onclick={() => router.push("/support")}>
      <div class="link-icon"><HelpCircle size={18} /></div>
      <span class="link-text">Support</span>
      {#if isActive("/support")}<div class="active-indicator"></div>{/if}
    </button>
  </div>
</aside>

<style>
  .sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 0;
    border-right: 1px solid var(--border-base);
    background-color: var(--bg-app);
  }

  .sidebar-header { padding: 32px 24px; }
  .logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .logo-mark { background: var(--primary); color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
  .logo-text { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.02em; color: var(--text-main); }

  .sidebar-nav { flex: 1; padding: 0 12px; display: flex; flex-direction: column; gap: 32px; overflow-y: auto; }
  .nav-group { display: flex; flex-direction: column; gap: 4px; }
  .group-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; padding: 0 16px 8px; }

  .nav-link {
    display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; transition: all var(--duration-fast) var(--ease-in-out); text-align: left; width: 100%; font-weight: 600; font-size: 0.9rem; position: relative;
  }
  .nav-link:hover { background: var(--surface-hover); color: var(--text-main); }
  .nav-link.active { background: rgba(var(--primary-rgb), 0.1); color: var(--primary); }

  .link-icon { display: flex; align-items: center; justify-content: center; width: 20px; }

  .active-indicator { position: absolute; left: 4px; top: 12px; bottom: 12px; width: 3px; background: var(--primary); border-radius: 4px; box-shadow: 0 0 10px var(--primary); }

  .curriculum-link { color: var(--secondary); }
  .curriculum-link.active { background: rgba(var(--secondary-rgb), 0.1); color: var(--secondary); }
  .curriculum-link.active .active-indicator { background: var(--secondary); box-shadow: 0 0 10px var(--secondary); }

  .sidebar-health { padding: 16px 12px; }
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--border-base); }

  @media (max-width: 1000px) {
    .link-text, .group-label, .logo-text, .sidebar-health, .active-indicator { display: none; }
    .nav-link, .logo { justify-content: center; padding: 12px; }
  }
</style>
