<script>
  import Router from "svelte-spa-router";
  import { onMount } from "svelte";
  import PlaylistEditor from "./components/core/PlaylistEditor.svelte";
  import New from "./views/New.svelte";
  import Saved from "./views/Saved.svelte";
  import Manage from "./views/Manage.svelte";
  import Support from "./views/Support.svelte";
  import OmniView from "./views/OmniView.svelte";
  import Curriculum from "./views/Curriculum.svelte";
  import PlaylistComparison from "./components/mega/PlaylistComparison.svelte";
  import UndoNotification from "./components/mega/UndoNotification.svelte";
  import GlobalHeader from "./components/mega/GlobalHeader.svelte";
  import StatusBar from "./components/mega/StatusBar.svelte";
  import CommandPalette from "./components/mega/CommandPalette.svelte";
  import DebugOverlay from "./components/mega/DebugOverlay.svelte";
  import StashDrawer from "./components/mega/StashDrawer.svelte";
  import { videoService } from "./services/core/video-service";

  const routes = {
    "/new": New,
    "/saved": Saved,
    "/editor": PlaylistEditor,
    "/playlist-builder": PlaylistEditor,
    "/manage": Manage,
    "/compare": PlaylistComparison,
    "/support": Support,
    "/omni": OmniView,
    "/curriculum/:id": Curriculum,
    "*": Saved,
  };

  let paletteOpen = false;
  let stashOpen = false;

  onMount(() => {
      const syncChannel = new BroadcastChannel("yph_sync_channel");
      const handleToggleStash = () => { stashOpen = !stashOpen; };
      window.addEventListener("toggleStash", handleToggleStash);

      return () => {
          syncChannel.close();
          window.removeEventListener("toggleStash", handleToggleStash);
      };
  });

  async function handleCreateFromStash(e) {
      const videos = e.detail;
      const ids = videos.map(v => v.videoId);
      const playlist = await videoService.generatePlaylist(ids, "Stashed Collection");
      videoService.openPlaylistEditor(playlist);
  }
</script>

<div class="app-layout">
  <GlobalHeader />

  <div class="main-content">
    <Router {routes} />
  </div>

  <StatusBar />
  <UndoNotification />
  <CommandPalette bind:isOpen={paletteOpen} />
  <DebugOverlay />
  <StashDrawer bind:open={stashOpen} on:createPlaylist={handleCreateFromStash} />
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
