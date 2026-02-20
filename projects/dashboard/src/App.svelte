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
  import { CommandPalette, SearchIcon, PlaylistPlusIcon, SaveIcon, InfoIcon, Filter } from "@yph/ui-kit";
  import { onMount } from "svelte";
  import { storageService } from "@yph/core";

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

  let showPalette = false;
  let commands: { id: string; title: string; subtitle?: string; action: () => void; icon?: any }[] = [];

  async function loadCommands() {
      const playlists = await storageService.getPlaylists();

      const staticCommands = [
          { id: 'nav-saved', title: 'View Saved Playlists', subtitle: 'Go to your collection', action: () => push('/saved'), icon: () => SaveIcon },
          { id: 'nav-new', title: 'Create New Playlist', subtitle: 'Start from scratch', action: () => push('/new'), icon: () => PlaylistPlusIcon },
          { id: 'nav-sync', title: 'Cloud Sync', subtitle: 'WebDAV Settings', action: () => push('/sync'), icon: () => Filter },
          { id: 'nav-support', title: 'Support & Help', subtitle: 'Get assistance', action: () => push('/support'), icon: () => InfoIcon },
      ];

      const playlistCommands = playlists.map(p => ({
          id: `playlist-${p.id}`,
          title: `Open: ${p.title}`,
          subtitle: `Playlist with ${p.videos.length} videos`,
          action: () => push(`/editor?id=${p.id}`),
          icon: () => SearchIcon
      }));

      commands = [...staticCommands, ...playlistCommands];
  }

  onMount(() => {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        loadCommands().then(() => {
            showPalette = true;
        });
      }
    });
  });
</script>

<div class="app-container">
  <Sidebar />
  <div class="main-content">
      <Router {routes} />
  </div>
  <UndoNotification />
  <CommandPalette bind:show={showPalette} {commands} />
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
