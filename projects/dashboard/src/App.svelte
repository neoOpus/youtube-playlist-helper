<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import PlaylistEditor from "./components/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import PlaylistComparison from "./components/PlaylistComparison.svelte";
  import ActionToast from "./components/ActionToast.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Sync from "./views/Sync.svelte";
  import CommandPalette from "./components/CommandPalette.svelte";
  import { playlistsSearch } from "./stores/playlists-filters";
  import { themeState, initTheme } from "./stores/theme.svelte";
  import { ParametricBackground } from "@yph/ui-kit";
  import { enrichmentAgent } from "@yph/core";
  import { router } from "./stores/router";

  const routes: Record<string, any> = {
    "/": Saved,
    "/new": New,
    "/manage": Manage,
    "/sync": Sync,
    "/merge": PlaylistComparison,
    "/support": Support,
    "/edit/:id": PlaylistEditor,
  };

  let showPalette = $state(false);
  let CurrentView = $derived(routes[$router.path] || Saved);

  // Use $effect for theme attribute sync - this replaces the .subscribe in the old store
  $effect(() => {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute("data-theme", themeState.active);
    }
  });

  onMount(async () => {
      await initTheme();
      enrichmentAgent.start();

      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
              if (e.key === "Escape") {
                  (e.target as HTMLElement).blur();
              }
              return;
          }

          if (e.key === "/") {
              e.preventDefault();
              const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (searchInput) searchInput.focus();
          } else if (e.key.toLowerCase() === "n") {
              router.push("/new");
          } else if (e.key.toLowerCase() === "s") {
              router.push("/");
          } else if (e.key.toLowerCase() === "m") {
              router.push("/manage");
          } else if (e.key === "Escape") {
              playlistsSearch.set("");
          }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
  });
</script>

<div class="app-container">
  <ParametricBackground theme={themeState.active} />
  <div class="sidebar-wrapper">
    <Sidebar activeRoute={$router.fullPath} />
  </div>
  <main class="main-content">
      <CurrentView params={$router.params} />
  </main>
  <ActionToast />
  <CommandPalette bind:display={showPalette} />
</div>

<style>
    :global(:root) {
        --sidebar-width: 260px;
    }

    .app-container {
        display: flex;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: relative;
        background: var(--bg);
    }

    .sidebar-wrapper {
        width: var(--sidebar-width);
        flex-shrink: 0;
        height: 100%;
        z-index: 10;
    }

    .main-content {
        flex-grow: 1;
        overflow-y: auto;
        position: relative;
        z-index: 1;
        padding: 0;
    }

    @media (max-width: 768px) {
        :global(:root) {
            --sidebar-width: 60px;
        }
    }
</style>
