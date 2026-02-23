<script lang="ts">
  import { onMount } from "svelte";
  import type { Playlist } from "../types/model";
  import Sidebar from "../components/core/Sidebar.svelte";
  import SuperButton from "../components/ui/SuperButton.svelte";
  import { supabaseService } from "../services/mega/supabase-service";
  import { storage } from "../services/core/storage-service";
  import Fa from "svelte-fa";
  import { faExchangeAlt, faCloudDownloadAlt, faCloudUploadAlt, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

  let conflicts: { local: Playlist, remote: Playlist }[] = [];
  let loading = true;

  onMount(async () => {
    await findConflicts();
  });

  async function findConflicts() {
      loading = true;
      const local = await storage.getPlaylists();
      const remote = await supabaseService.fetchRemotePlaylists();

      const found = [];
      for (const r of remote) {
          const l = local.find(p => p.id === r.id);
          if (l && l.version !== r.version) {
              found.push({ local: l, remote: r });
          }
      }
      conflicts = found;
      loading = false;
  }

  async function resolve(index: number, winner: 'local' | 'remote') {
      const { local, remote } = conflicts[index];
      if (winner === 'remote') {
          await storage.savePlaylist(remote);
      } else {
          await supabaseService.syncPlaylists([local]);
      }
      conflicts = conflicts.filter((_, i) => i !== index);
  }
</script>

<Sidebar />

<main>
    <header>
        <h1><Fa icon={faExchangeAlt} /> Intelligence Sync Resolver</h1>
        <p>Conflicts detected between your local storage and the sovereign cloud.</p>
    </header>

    {#if loading}
        <div class="loading">Analyzing synchronization state...</div>
    {:else if conflicts.length === 0}
        <div class="empty">
            <Fa icon={faExclamationCircle} size="3x" color="#10b981" />
            <p>Your ecosystem is perfectly synchronized.</p>
            <SuperButton variant="primary" on:click={() => window.location.hash = '/'}>Return to Dashboard</SuperButton>
        </div>
    {:else}
        <div class="conflict-list">
            {#each conflicts as conflict, i}
                <div class="conflict-card">
                    <div class="info">
                        <h3>{conflict.local.title}</h3>
                        <p>Inconsistent versions detected (L: v{conflict.local.version} vs R: v{conflict.remote.version})</p>
                    </div>

                    <div class="comparison">
                        <div class="side local">
                            <span class="label"><Fa icon={faCloudDownloadAlt} /> Local Version</span>
                            <span class="count">{conflict.local.videos.length} Videos</span>
                            <SuperButton on:click={() => resolve(i, 'local')} variant="secondary" size="sm">Keep Local</SuperButton>
                        </div>
                        <div class="divider"><Fa icon={faExchangeAlt} /></div>
                        <div class="side remote">
                            <span class="label"><Fa icon={faCloudUploadAlt} /> Cloud Version</span>
                            <span class="count">{conflict.remote.videos.length} Videos</span>
                            <SuperButton on:click={() => resolve(i, 'remote')} variant="primary" size="sm">Accept Cloud</SuperButton>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>

<style>
  main { padding: 3rem 6rem; max-width: 1000px; margin: 0 auto; }
  h1 { display: flex; align-items: center; gap: 1rem; }

  .conflict-list { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
  .conflict-card { background: white; border: 1px solid #eee; border-radius: 20px; padding: 2rem; }

  .comparison { display: flex; align-items: center; gap: 2rem; margin-top: 1.5rem; background: #f8fafc; padding: 1.5rem; border-radius: 12px; }
  .side { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .label { font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: #64748b; }
  .count { font-size: 1.2rem; font-weight: bold; }

  .divider { color: #cbd5e1; }

  .empty { text-align: center; padding: 5rem; }
</style>
