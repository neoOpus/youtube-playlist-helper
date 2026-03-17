<script lang="ts">
  import Router, { push } from "svelte-spa-router";
  import PlaylistEditor from "./components/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import PlaylistComparison from "./components/PlaylistComparison.svelte";
  import UndoNotification from "./components/UndoNotification.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Sync from "./views/Sync.svelte";
  import { onMount } from "svelte";
  import { playlistsSearch } from "./stores/playlists-filters";
  import { activeTheme } from "./stores/theme.store";
  import { ParametricBackground } from "@yph/ui-kit";

  const routes = {
    "/new": New,
    "/saved": Saved,
    "/editor": PlaylistEditor,
    "/playlist-builder": PlaylistEditor,
    "/manage": Manage,
    "/compare": PlaylistComparison,
    "/support": Support,
    "/sync": Sync,
    "*": Saved,
  };

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
              push("/saved");
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
  <Sidebar />
  <div class="main-content">
      <Router {routes} />
  </div>
  <UndoNotification />
</div>

<style>
    :global(:root) {
        --sidebar-width: 240px;
        --sidebar-collapsed-width: 60px;
    }

    .app-container {
        display: flex;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: relative;
    }

    .main-content {
        flex-grow: 1;
        overflow-y: auto;
        padding-left: var(--sidebar-width);
        transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 1;
    }

    :global(.is-collapsed) + .main-content {
        padding-left: var(--sidebar-collapsed-width);
    }

    @media (max-width: 768px) {
        .main-content {
            padding-left: var(--sidebar-collapsed-width);
        }
    }
</style>
