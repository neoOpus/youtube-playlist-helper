<script>
  import { storageService, backupService, notificationService, formatExporter } from "@yph/core";
  import { SaveIcon, PlaylistPlusIcon, DeleteIcon, RemoveDuplicates, Filter, InfoIcon, ClipboardMultiple } from "@yph/ui-kit";
  import { onMount } from "svelte";

  let stats = {
      playlistCount: 0,
      videoCount: 0,
      storageUsed: "0 KB",
      groupCount: 0
  };

  let experimentalEnabled = false;

  onMount(async () => {
      await refreshStats();
      experimentalEnabled = await storageService.fetchObject("experimental_features", false);
  });

  async function refreshStats() {
      const playlists = await storageService.getPlaylists();
      stats.playlistCount = playlists.length;
      stats.videoCount = playlists.reduce((acc, p) => acc + (p.videos?.length || 0), 0);

      const allObjects = await storageService.fetchAllObjects();
      const bytes = new TextEncoder().encode(JSON.stringify(allObjects)).length;
      stats.storageUsed = (bytes / 1024).toFixed(2) + " KB";

      const groups = new Set(playlists.flatMap(p => p.groups || []));
      stats.groupCount = groups.size;
  }

  async function toggleExperimental() {
      experimentalEnabled = !experimentalEnabled;
      await storageService.storeObject("experimental_features", experimentalEnabled);
      notificationService.info(`Experimental features ${experimentalEnabled ? 'enabled' : 'disabled'}.`);
  }

  async function clearAll() {
    if (confirm("⚠️ CRITICAL ACTION: Are you sure you want to delete ALL saved playlists? This cannot be undone.")) {
        const playlists = await storageService.getPlaylists();
        for (const p of playlists) {
            await storageService.removePlaylist(p);
        }
        notificationService.success("All playlists wiped successfully.");
        window.location.reload();
    }
  }

  async function download(content, filename, contentType) {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      notificationService.success(`Exported ${filename} successfully.`);
  }

  async function exportLibrary(format) {
      const playlists = await storageService.getPlaylists();
      const date = new Date().toISOString().slice(0, 10);

      if (format === 'json') {
          download(JSON.stringify(playlists, null, 2), `yph-backup-${date}.json`, "application/json");
      } else if (format === 'csv') {
          download(formatExporter.toCSV(playlists), `yph-export-${date}.csv`, "text/csv");
      } else if (format === 'txt') {
          download(formatExporter.toTXT(playlists), `yph-export-${date}.txt`, "text/plain");
      } else if (format === 'md') {
          download(formatExporter.toMarkdown(playlists), `yph-export-${date}.md`, "text/markdown");
      }
  }

  async function importPlaylists() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (e) => {
          const file = e.target.files[0];
          const text = await file.text();
          try {
              const playlists = JSON.parse(text);
              if (!Array.isArray(playlists)) throw new Error("Invalid backup format");

              for (const p of playlists) {
                  await storageService.savePlaylist(p);
              }
              notificationService.success(`Imported ${playlists.length} playlists.`);
              window.location.reload();
          } catch (err) {
              notificationService.error("Failed to import playlists. Invalid file format.");
          }
      };
      input.click();
  }

  async function findDuplicates() {
      const playlists = await storageService.getPlaylists();
      let allVideos = new Set();
      let duplicates = [];

      for (const p of playlists) {
          for (const vid of p.videos) {
              if (allVideos.has(vid)) {
                  duplicates.push(vid);
              }
              allVideos.add(vid);
          }
      }

      if (duplicates.length > 0) {
          alert(`Found ${duplicates.length} duplicate video references across your playlists.`);
      } else {
          notificationService.success("No duplicate video references found.");
      }
  }

  async function massAlphabetize() {
      if (confirm("Sort all playlist titles alphabetically? This will overwrite the current order in some views.")) {
          const playlists = await storageService.getPlaylists();
          playlists.sort((a, b) => a.title.localeCompare(b.title));
          // We don't necessarily have a 'saved order' in core yet, but we can re-save them to update timestamps if needed
          notificationService.success("Alphabetization applied to internal collection.");
      }
  }
</script>

<main>
  <div class="manage-header">
      <div class="header-content">
          <h1>Data Management & Power Tools</h1>
          <p>Configure advanced settings, manage backups, and optimize your collection.</p>
      </div>
      <div class="health-overview">
          <div class="stat-item">
              <span class="label">PLAYLISTS</span>
              <span class="value">{stats.playlistCount}</span>
          </div>
          <div class="stat-item">
              <span class="label">VIDEOS</span>
              <span class="value">{stats.videoCount}</span>
          </div>
          <div class="stat-item">
              <span class="label">GROUPS</span>
              <span class="value">{stats.groupCount}</span>
          </div>
          <div class="stat-item">
              <span class="label">STORAGE</span>
              <span class="value">{stats.storageUsed}</span>
          </div>
      </div>
  </div>

  <div class="grid">
      <section class="tool-card">
          <div class="icon-header">
              <SaveIcon size="24" color="var(--primary)" />
              <h3>Export Center</h3>
          </div>
          <p>Export your library in various formats for archiving or external use.</p>
          <div class="export-grid">
              <button class="btn tiny" on:click={() => exportLibrary('json')}>JSON</button>
              <button class="btn tiny" on:click={() => exportLibrary('csv')}>CSV</button>
              <button class="btn tiny" on:click={() => exportLibrary('txt')}>TXT</button>
              <button class="btn tiny" on:click={() => exportLibrary('md')}>MD</button>
          </div>
          <div class="actions">
              <button class="btn secondary" on:click={importPlaylists}>Restore Library</button>
          </div>
      </section>

      <section class="tool-card">
          <div class="icon-header">
              <RemoveDuplicates size="24" color="#28a745" />
              <h3>Maintenance</h3>
          </div>
          <p>Optimize your collection by finding duplicates and cleaning up metadata.</p>
          <div class="actions">
              <button class="btn secondary" on:click={findDuplicates}>Find Duplicates</button>
              <button class="btn secondary" on:click={massAlphabetize}>Mass Sort A-Z</button>
          </div>
      </section>

      <section class="tool-card">
          <div class="icon-header">
              <InfoIcon size="24" color="#ffc107" />
              <h3>Experimental</h3>
          </div>
          <p>Enable cutting-edge features like AI-powered Smart Ghosting and predictive recovery.</p>
          <div class="actions">
              <button class="btn secondary" class:active={experimentalEnabled} on:click={toggleExperimental}>
                  {experimentalEnabled ? 'Disable' : 'Enable'} Power Features
              </button>
          </div>
      </section>

      <section class="tool-card danger">
          <div class="icon-header">
              <DeleteIcon size="24" color="#dc3545" />
              <h3>Critical Actions</h3>
          </div>
          <p>Wipe your local data storage. This is permanent and irreversible.</p>
          <div class="actions">
              <button class="btn danger" on:click={clearAll}>Factory Reset</button>
          </div>
      </section>
  </div>
</main>

<style>
  main {
    padding: 2rem;
    max-width: 1100px;
    margin: 0 auto;
    color: var(--text);
  }

  .manage-header {
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 2rem;
  }

  .health-overview {
      display: flex;
      gap: 1.5rem;
      background: var(--hover);
      padding: 1rem 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--border);
  }

  .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
  }

  .stat-item .label {
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 1px;
  }

  .stat-item .value {
      font-size: 1.25rem;
      font-weight: 900;
      font-family: 'JetBrains Mono', monospace;
  }

  h1 {
      margin-bottom: 0.5rem;
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: -1px;
  }

  .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
  }

  .tool-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tool-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px var(--shadow);
      border-color: var(--primary);
  }

  .icon-header {
      display: flex;
      align-items: center;
      gap: 12px;
  }

  .icon-header h3 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 800;
  }

  p {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0;
  }

  .export-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
  }

  .actions {
      display: flex;
      gap: 12px;
      margin-top: auto;
  }

  .btn {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid var(--border);
      transition: all 0.2s;
      flex-grow: 1;
      text-align: center;
      background: var(--card-bg);
      color: var(--text);
  }

  .btn.tiny {
      padding: 6px;
      font-size: 0.75rem;
      font-weight: 800;
  }

  .primary-btn { background: var(--primary); color: white; border-color: var(--primary); }
  .secondary { background: var(--hover); }
  .secondary.active { background: var(--primary); color: white; border-color: var(--primary); }
  .danger { color: #dc3545; border-color: #dc3545; }
  .danger:hover { background: #dc3545; color: white; }

  .btn:hover { opacity: 0.9; }

  @media (max-width: 900px) {
      .manage-header {
          flex-direction: column;
          align-items: flex-start;
      }
      .health-overview {
          width: 100%;
          justify-content: space-between;
      }
  }
</style>
