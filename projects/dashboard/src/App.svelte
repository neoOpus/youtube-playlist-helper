<script lang="ts">
  import Router from "svelte-spa-router";
  import PlaylistEditor from "./components/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import PlaylistComparison from "./components/PlaylistComparison.svelte";
  import UndoNotification from "./components/UndoNotification.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Sync from "./views/Sync.svelte";

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
</script>

<div class="app-container">
  <Sidebar />
  <div class="main-content">
      <Router {routes} />
  </div>
  <UndoNotification />
</div>

<style>
    .app-container {
        display: flex;
        width: 100%;
        height: 100%;
    }
    .main-content {
        flex-grow: 1;
    }
</style>
