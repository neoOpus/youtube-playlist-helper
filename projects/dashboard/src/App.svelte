<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import PlaylistEditor from "./components/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import Sync from "./views/Sync.svelte";
  import ActionToast from "./components/ActionToast.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import ProErrorBoundary from "./components/ProErrorBoundary.svelte";
  import { appState, initAppState } from "./stores/theme.svelte";
  import { router } from "./stores/router";

  const routes: Record<string, any> = {
    "/": Saved,
    "/new": New,
    "/manage": Manage,
    "/sync": Sync,
    "/support": Support,
    "/edit/:id": PlaylistEditor,
  };

  let CurrentView = $derived(routes[router.path] || Saved);
  let errorBoundary: any = $state();

  $effect(() => {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute("data-theme", appState.theme);
        document.documentElement.setAttribute("data-density", appState.density);
    }
  });

  onMount(() => {
      initAppState().catch((e) => errorBoundary?.catchError(e as Error));
  });
</script>

<ProErrorBoundary bind:this={errorBoundary}>
    <div class="app-container">
      <div class="sidebar-wrapper">
        <Sidebar activeRoute={router.fullPath} />
      </div>
      <main class="main-content">
          {#key router.path}
            <div
                class="view-transition-wrapper"
                in:fade={{ duration: 150 }}
            >
                <CurrentView params={router.params} />
            </div>
          {/key}
      </main>
      <ActionToast />
    </div>
</ProErrorBoundary>

<style>
    .app-container {
        display: flex; width: 100%; height: 100vh; overflow: hidden;
        background-color: var(--bg-app);
    }
    .sidebar-wrapper { width: 220px; flex-shrink: 0; height: 100%; }
    .main-content { flex: 1; overflow-y: auto; padding: 2rem; position: relative; }

    .view-transition-wrapper {
        width: 100%; height: 100%;
        display: flex; flex-direction: column;
    }
</style>
