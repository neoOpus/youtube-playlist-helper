<script lang="ts">
  import { link, push } from "svelte-spa-router";
  import Fa from "svelte-fa";
  import { faSearch, faMoon, faSun, faCog, faLifeRing, faUserCircle } from "@fortawesome/free-solid-svg-icons";
  import SuperButton from "../ui/SuperButton.svelte";
  import { themeStore } from "../../stores/theme.store";
  import { onMount } from "svelte";
  import { supabaseService } from "../../services/mega/supabase-service";

  let searchQuery = "";
  let user: any = null;

  onMount(async () => {
    if (supabaseService.isConfigured) {
        user = await supabaseService.getUser();
    }
  });

  function handleSearch(e: KeyboardEvent) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log("Global search:", searchQuery);
    }
  }

  function toggleTheme() {
    themeStore.update(current => current === 'dark' ? 'light' : 'dark');
  }
</script>

<header class="global-header">
  <div class="left">
    <a href="/" use:link class="logo">
      <img src="icons/icon48.png" alt="Logo" width="24" height="24" />
      <span>Playlist Helper <span>PRO</span></span>
    </a>
  </div>

  <div class="center">
    <div class="search-bar">
      <Fa icon={faSearch} />
      <input
        type="text"
        placeholder="Search playlists or videos..."
        bind:value={searchQuery}
        on:keydown={handleSearch}
      />
    </div>
  </div>

  <div class="right">
    <SuperButton on:click={toggleTheme} title="Toggle Theme" circle bgcolor="transparent" className="header-icon">
      <Fa icon={$themeStore === 'dark' ? faSun : faMoon} />
    </SuperButton>

    <a href="/manage" use:link title="Account & Settings">
       <SuperButton circle bgcolor="transparent" className="header-icon">
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
       <SuperButton circle bgcolor="transparent" className="header-icon">
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
    z-index: 100;
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

  .center {
    flex: 0 1 400px;
  }

  .search-bar {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 6px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .search-bar input {
    background: transparent;
    border: none;
    color: white;
    width: 100%;
    outline: none;
  }

  .search-bar input::placeholder {
    color: rgba(255,255,255,0.5);
  }

  .right {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  :global(.header-icon) {
    color: white !important;
  }

  .avatar-small {
      width: 24px;
      height: 24px;
      border-radius: 50%;
  }
</style>
