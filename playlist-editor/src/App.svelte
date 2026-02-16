<script>
  import Router from "svelte-spa-router";
  import PlaylistEditor from "./components/core/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import OmniView from "./views/OmniView.svelte";
  import PlaylistComparison from "./components/mega/PlaylistComparison.svelte";
  import UndoNotification from "./components/mega/UndoNotification.svelte";
  import GlobalHeader from "./components/mega/GlobalHeader.svelte";
  import StatusBar from "./components/mega/StatusBar.svelte";
  import CommandPalette from "./components/mega/CommandPalette.svelte";

  const routes = {
    "/new": New,
    "/saved": Saved,
    "/editor": PlaylistEditor,
    "/playlist-builder": PlaylistEditor,
    "/manage": Manage,
    "/compare": PlaylistComparison,
    "/support": Support,
    "/omni": OmniView,
    "*": Saved,
  };

  let paletteOpen = false;
</script>

<div class="app-layout">
  <GlobalHeader />

  <div class="main-content">
    <Router {routes} />
  </div>

  <StatusBar />
  <UndoNotification />
  <CommandPalette bind:isOpen={paletteOpen} />
</div>

<style>
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding-bottom: 30px;
    overflow-y: auto;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
</style>
