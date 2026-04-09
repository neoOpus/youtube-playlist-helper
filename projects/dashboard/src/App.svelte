<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import PlaylistEditor from "./components/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import Gallery from "./views/Gallery.svelte";
  import PlaylistComparison from "./components/PlaylistComparison.svelte";
  import ActionToast from "./components/ActionToast.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Sync from "./views/Sync.svelte";
  import CommandPalette from "./components/CommandPalette.svelte";
  import ProErrorBoundary from "./components/ProErrorBoundary.svelte";
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
    "/gallery": Gallery,
    "/edit/:id": PlaylistEditor,
  };

  let showPalette = $state(false);
  let CurrentView = $derived(routes[$router.path] || Saved);
  let errorBoundary: any = $state();

  // Use $effect for theme attribute sync
  $effect(() => {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute("data-theme", themeState.active);
    }
  });

  onMount(() => {
      initTheme()
          .then(() => enrichmentAgent.start())
          .catch((e) => errorBoundary?.catchError(e as Error));

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
          } else if (e.key.toLowerCase() === "g") {
              router.push("/gallery");
          } else if (e.key === "Escape") {
              playlistsSearch.set("");
          }
      };

      const handleError = (e: ErrorEvent) => errorBoundary?.catchError(e.error);
      const handleRejection = (e: PromiseRejectionEvent) => errorBoundary?.catchError(e.reason);

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("error", handleError);
      window.addEventListener("unhandledrejection", handleRejection);

      return () => {
          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("error", handleError);
          window.removeEventListener("unhandledrejection", handleRejection);
      };
  });
</script>

<ProErrorBoundary bind:this={errorBoundary}>
    <div class="app-container">
      <ParametricBackground theme={themeState.active} />
      <div class="sidebar-wrapper">
        <Sidebar activeRoute={$router.fullPath} />
      </div>
      <main class="main-content">
          {#key $router.path}
            <div
                class="view-transition-wrapper"
                in:fly={{ y: 10, duration: 400, delay: 100 }}
                out:fade={{ duration: 200 }}
            >
                <CurrentView params={$router.params} />
            </div>
          {/key}
      </main>
      <ActionToast />
      <CommandPalette bind:display={showPalette} />
    </div>
</ProErrorBoundary>

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

    .view-transition-wrapper {
        min-height: 100%;
    }

    @media (max-width: 768px) {
        :global(:root) {
            --sidebar-width: 60px;
        }
    }
</style>
