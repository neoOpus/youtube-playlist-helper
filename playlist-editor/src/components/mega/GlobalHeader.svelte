<script lang="ts">
  import { link } from "svelte-spa-router";
  import Fa from "svelte-fa";
  import { faSearch, faMoon, faSun, faCog, faLifeRing, faUserCircle, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
  import SuperButton from "../ui/SuperButton.svelte";
  import { themeStore } from "../../stores/theme.store";
  import { onMount } from "svelte";
  import { supabaseService } from "../../services/mega/supabase-service";
  import { stashService } from "../../services/mega/stash-service";

  let searchQuery = "";
  let user: any = null;
  let currentWorkspace = "Default Sovereign";
  const workspaces = ["Default Sovereign", "Research", "Leisure", "Deep Work"];
  const stash = stashService.stashStore;

  onMount(async () => {
    if (supabaseService.isConfigured) {
        user = await supabaseService.getUser();
    }
  });

  function toggleTheme() {
    themeStore.update(current => current === 'dark' ? 'light' : 'dark');
  }

  function openPalette() {
      window.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          bubbles: true
      }));
  }

  function toggleStash() {
      window.dispatchEvent(new CustomEvent("toggleStash"));
  }
</script>

<header class="global-header">
  <div class="left">
    <a href="/" use:link class="logo">
      <img src="icons/icon48.png" alt="Logo" width="24" height="24" />
      <span>Playlist Helper <span>PRO</span></span>
    </a>
  </div>

      <div class="workspace-switcher">
        <select bind:value={currentWorkspace}>
            {#each workspaces as ws}
                <option value={ws}>{ws}</option>
            {/each}
        </select>
        <span class="pulse-light"></span>
    </div>

    <div class="center">
    <div class="search-bar" on:click={openPalette} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openPalette()}>
      <Fa icon={faSearch} />
      <span class="search-placeholder">Press Ctrl+K to search actions...</span>
      <span class="kbd">Ctrl K</span>
    </div>
  </div>

  <div class="right">
    <SuperButton on:click={toggleStash} title="Open Stash" variant="ghost" className="header-icon">
      <Fa icon={faBoxOpen} />
      {#if $stash.length > 0}
        <span class="stash-badge">{$stash.length}</span>
      {/if}
    </SuperButton>

    <SuperButton on:click={toggleTheme} title="Toggle Theme" variant="ghost" className="header-icon">
      <Fa icon={$themeStore === 'dark' ? faSun : faMoon} />
    </SuperButton>

    <a href="/manage" use:link title="Account & Settings">
       <SuperButton variant="ghost" className="header-icon">
         {#if user && user.user_metadata?.avatar_url}
            <img src={user.user_metadata.avatar_url} alt="User" class="avatar-small" />
         {:else if user}
            <Fa icon={faUserCircle} />
         {:else}
            <Fa icon={faCog} />
         {/if}
       </SuperButton>
    </a>

    <a href="/support" use:link title="Help & Support">
       <SuperButton variant="ghost" className="header-icon">
         <Fa icon={faLifeRing} />
       </SuperButton>
    </a>
  </div>
</header>

<style>
  .global-header {
    height: 60px;
    background: var(--sidebar-bg-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .left .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .logo span span {
    font-size: 0.7rem;
    background: #ff4444;
    padding: 2px 4px;
    border-radius: 4px;
    vertical-align: super;
  }

  .center { flex: 0 1 450px; }

  .search-bar {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px 15px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .search-bar:hover { background: rgba(255, 255, 255, 0.15); }
  .search-placeholder { flex: 1; color: rgba(255,255,255,0.6); font-size: 0.9rem; }
  .kbd { background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; }

  .right { display: flex; gap: 10px; align-items: center; }
  :global(.header-icon) { color: white !important; box-shadow: none !important; position: relative; }

  .stash-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #f59e0b;
      color: white;
      font-size: 0.6rem;
      font-weight: bold;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--sidebar-bg-color);
  }

  .avatar-small { width: 24px; height: 24px; border-radius: 50%; }
  .workspace-switcher { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.2); padding: 4px 12px; border-radius: 30px; margin-right: 1.5rem; position: relative; }
  .workspace-switcher select { background: transparent; border: none; color: white; font-size: 0.75rem; font-weight: bold; cursor: pointer; outline: none; appearance: none; -webkit-appearance: none; }
  .pulse-light { width: 6px; height: 6px; background: #10b981; border-radius: 50%; box-shadow: 0 0 5px #10b981; }

</style>
