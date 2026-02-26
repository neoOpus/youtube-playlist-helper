<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faFileExport,
    faFileImport,
    faTriangleExclamation,
  } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import LargeButton from "../components/LargeButton.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import type { PlaylistExport } from "../types/model.js";
  import { syncService, type SyncConfig } from "../services/sync-service";

  let syncConfig: SyncConfig = { enabled: false, type: "webdav" };
  // Add integration listener
  const channel = new BroadcastChannel("neoopus_integration");
  channel.onmessage = (event) => {
    if (event.data.type === "IMPORT_DESCRIPTION") {
      console.log("Phoenix Integration: Received description import", event.data.content);
      window.success("Imported description from Phoenix Recovery");
    }
  };
  let syncing = false;

  onMount(async () => {
    syncConfig = await syncService.getSyncConfig();
  });

  async function saveSync() {
    await syncService.saveSyncConfig(syncConfig);
    window.success("Sync settings saved");
  }

  async function syncNow() {
    syncing = true;
    try {
      await syncService.syncNow();
      window.success("Sync complete");
    } catch (e) {
      window.error(e.message);
    } finally {
      syncing = false;
    }
  }

  function exportFile(content: string, filename?: string) {
    var textToSaveAsBlob = new Blob([content], { type: "application/json" });
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var downloadLink = document.createElement("a");
    downloadLink.download = filename ? filename : "export.json";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = function () {
      downloadLink.remove();
    };
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  async function exportSavedPlaylists() {
    const playlists = await window.getPlaylists();
    const playlistsExports: PlaylistExport[] = playlists.map(
      ({ title, videos, timestamp }) => ({
        title,
        videos,
        timestamp,
      })
    );
    exportFile(JSON.stringify(playlistsExports), "saved-playlists.json");
  }
  async function removeSavedPlaylists() {
    if (confirm("All the saved playlists are about to be deleted")) {
      await window.removeSavedPlaylists();
      window.success("All saved playlists were successfully removed");
    }
  }

  async function importSavedPlaylists() {
    const fileInput = document.getElementById(
      "ImportSavedPlaylists"
    ) as HTMLInputElement;
    fileInput.onchange = () => {
      let fr = new FileReader();
      fr.onload = async () => {
        try {
          let playlistsExport: PlaylistExport[] = JSON.parse(
            fr.result as string
          );
          await window.importPlaylists(playlistsExport);
          window.success("The playlists were successfully imported");
        } catch (e) {
          console.log(e);
          window.error("The file is incorrectly formatted");
        }
        fileInput.value = null;
      };
      const file = fileInput.files[0];
      fr.readAsText(file);
    };
    fileInput.click();
  }
</script>

<Sidebar />

<main style="padding: 5rem;">
  <LargeButton on:click={exportSavedPlaylists}>
    <Fa icon={faFileExport} />
    Export saved playlists
  </LargeButton>

  <LargeButton on:click={importSavedPlaylists} style="margin-top: 1rem;">
    <Fa icon={faFileImport} />
    Import saved playlists
  </LargeButton>

  <div class="sync-settings">
    <h3>Cloud Sync (WebDAV)</h3>
    <label>
        <input type="checkbox" bind:checked={syncConfig.enabled} /> Enable Cloud Sync
    </label>
    {#if syncConfig.enabled}
        <div class="sync-fields">
            <input type="text" placeholder="WebDAV URL" bind:value={syncConfig.url} />
            <input type="text" placeholder="Username" bind:value={syncConfig.username} />
            <input type="password" placeholder="Password" bind:value={syncConfig.password} />
        </div>
    {/if}
    <div class="sync-actions">
        <button on:click={saveSync}>Save Sync Settings</button>
        <button on:click={syncNow} disabled={syncing || !syncConfig.enabled}>
            {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
    </div>
  </div>

  <div class="spacer" />

  <LargeButton
    on:click={removeSavedPlaylists}
    style="margin-top: 1rem; color: black; background-color: #FF8080"
  >
    <Fa icon={faTriangleExclamation} />
    Delete all saved playlists
  </LargeButton>
</main>

<input id="ImportSavedPlaylists" style="visibility: hidden;" type="file" />

<style>
  main {
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 2rem;
  }
  .spacer {
    flex-grow: 1;
    min-height: 2rem;
  }

  .sync-settings {
    border: 1px solid var(--border-color);
    padding: 1.5rem;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.02);
  }

  .sync-fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .sync-actions {
    display: flex;
    gap: 1rem;
  }

  .sync-actions button {
      padding: 8px 16px;
      cursor: pointer;
  }
</style>
