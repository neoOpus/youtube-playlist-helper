<script lang="ts">
  import Router, { push, location } from "svelte-spa-router";
  import PlaylistEditor from "./components/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import PlaylistComparison from "./components/PlaylistComparison.svelte";
  import UndoNotification from "./components/UndoNotification.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Sync from "./views/Sync.svelte";
  import CommandPalette from "./components/CommandPalette.svelte";
  import { onMount } from "svelte";
  import { playlistsSearch } from "./stores/playlists-filters";
  import { activeTheme } from "./stores/theme.store";
  import { ParametricBackground } from "@yph/ui-kit";

  const routes = {
    "/": Saved,
    "/new": New,
    "/manage": Manage,
    "/sync": Sync,
    "/merge": PlaylistComparison,
    "/support": Support,
    "/edit/:id": PlaylistEditor,
    "*": Saved,
  };

  let showPalette = false;

  import { enrichmentAgent } from "@yph/core";
  onMount(() => { enrichmentAgent.start(); });
  onMount(() => {
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
              push("/new");
          } else if (e.key.toLowerCase() === "s") {
              push("/");
          } else if (e.key.toLowerCase() === "m") {
              push("/manage");
          } else if (e.key === "Escape") {
              playlistsSearch.set("");
          }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
  });
</script>

<div class="app-container">
  <ParametricBackground theme={$activeTheme} />
  <div class="sidebar-wrapper">
    <Sidebar activeRoute={$location} />
  </div>
  <main class="main-content">
      <Router {routes} />
  </main>
  <UndoNotification />
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
