<script>
  import Router from "svelte-spa-router";
  import PlaylistEditor from "./components/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import PlaylistComparison from "./components/PlaylistComparison.svelte";
  import UndoNotification from "./components/UndoNotification.svelte";

  const routes = {
    "/new": New,
    "/saved": Saved,
    "/editor": PlaylistEditor,
    "/playlist-builder": PlaylistEditor,
    "/manage": Manage,
    "/compare": PlaylistComparison,
    "/support": Support,
    "*": Saved,
  };
</script>

<div class="app-container">
  <main>
    <Router {routes} />
  </main>
  <UndoNotification />

  <footer class="neo-footer">
    (c) 2026 <span>neoOpus</span> | Ultimate Monorepo Suite
  </footer>
</div>

<style>
  main {
      flex: 1;
  }
</style>
