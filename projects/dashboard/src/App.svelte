<svelte:options runes={true} />
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import PlaylistEditor from "./components/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import Gallery from "./views/Gallery.svelte";
  import Curriculum from "./views/Curriculum.svelte";
  import PlaylistComparison from "./components/PlaylistComparison.svelte";
  import ActionToast from "./components/ActionToast.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Sync from "./views/Sync.svelte";
  import CommandPalette from "./components/CommandPalette.svelte";
  import ShortcutHUD from "./components/ShortcutHUD.svelte";
  import ProErrorBoundary from "./components/ProErrorBoundary.svelte";
  import { filtersState } from "./stores/playlists-filters";
  import { appState, initAppState } from "./stores/theme.svelte";
  import { enrichmentAgent, recoveryAgent } from "@yph/core";
  import { router } from "./stores/router";
  import { ParametricBackground } from "@yph/ui-kit";

  const routes: Record<string, any> = {
    "/": Saved,
    "/new": New,
    "/manage": Manage,
    "/sync": Sync,
    "/merge": PlaylistComparison,
    "/support": Support,
    "/gallery": Gallery,
    "/edit/:id": PlaylistEditor,
    "/path/:id": Curriculum,
  };

  let showPalette = $state(false);
  let showHUD = $state(false);
  let CurrentView = $derived(routes[router.path] || Saved);
  let errorBoundary: any = $state();

  let prevPath = "";
  let direction = $state(1);

  $effect(() => {
      const current = router.path;
      if (current !== prevPath) {
          const order = ["/", "/new", "/manage", "/sync", "/support"];
          const prevIdx = order.indexOf(prevPath);
          const currIdx = order.indexOf(current);
          direction = currIdx >= prevIdx ? 1 : -1;
          prevPath = current;
      }
  });

  $effect(() => {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute("data-theme", appState.theme);
        document.documentElement.setAttribute("data-density", appState.density);
        document.documentElement.setAttribute("data-animation", appState.animation);
        document.documentElement.style.fontSize = `${appState.fontScale * 100}%`;
    }
  });

  onMount(() => {
      initAppState()
          .then(() => {
              enrichmentAgent.start();
              recoveryAgent.start();
          })
          .catch((e) => errorBoundary?.catchError(e as Error));

      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
              if (e.key === "Escape") (e.target as HTMLElement).blur();
              return;
          }

          if (e.key === "/") {
              e.preventDefault();
              const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (searchInput) searchInput.focus();
          } else if (e.key.toLowerCase() === "n") router.push("/new");
          else if (e.key.toLowerCase() === "s") router.push("/");
          else if (e.key.toLowerCase() === "m") router.push("/manage");
          else if (e.key.toLowerCase() === "g") router.push("/gallery");
          else if (e.key === "Escape") filtersState.search = "";

          if ((e.metaKey || e.ctrlKey) && e.key === "/") {
              e.preventDefault();
              showHUD = !showHUD;
          }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
  });
</script>

<ProErrorBoundary bind:this={errorBoundary}>
    <ParametricBackground theme={appState.theme} intensity={appState.lowPowerMode ? 'none' : appState.animation} />

    <div class="app-container" class:sidebar-right={appState.sidebar === 'right'}>
      <div class="sidebar-wrapper">
        <Sidebar activeRoute={router.fullPath} />
      </div>
      <main class="main-content">
          {#key router.path}
            <div
                class="view-transition-wrapper"
                in:fly={{ x: appState.reducedMotion ? 0 : 20 * direction, duration: 400, easing: backOut }}
                out:fade={{ duration: 200 }}
            >
                <CurrentView params={router.params} />
            </div>
          {/key}
      </main>
      <ActionToast />
      <CommandPalette bind:display={showPalette} />
      <ShortcutHUD bind:display={showHUD} />
    </div>
</ProErrorBoundary>

<style>
    .app-container {
        display: flex; width: 100%; height: 100vh; overflow: hidden;
    }
    .app-container.sidebar-right { flex-direction: row-reverse; }
    .sidebar-wrapper { width: var(--sidebar-width); flex-shrink: 0; height: 100%; z-index: 100; }
    .main-content { flex: 1; overflow-y: auto; padding: var(--ui-padding); position: relative; }

    .view-transition-wrapper {
        width: 100%; height: 100%;
        display: flex; flex-direction: column; gap: var(--ui-gap);
    }

    @media (max-width: 768px) { .sidebar-wrapper { width: var(--sidebar-collapsed-width); } }
</style>
