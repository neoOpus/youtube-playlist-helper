<script lang="ts">
  import { onMount } from "svelte";
  import type { Playlist, Video } from "../types/model";
  import Sidebar from "../components/core/Sidebar.svelte";
  import PlaylistVideo from "../components/core/PlaylistVideo.svelte";
  import { storage } from "../services/core/storage-service";
  import { videoService } from "../services/core/video-service";
  import Fa from "svelte-fa";
  import { faGraduationCap, faLayerGroup, faBookOpen } from "@fortawesome/free-solid-svg-icons";

  export let params: any = {};

  let playlist: Playlist | null = null;
  let modules: { name: string, videos: Video[] }[] = [];
  let loading = true;

  onMount(async () => {
    const id = params.id;
    if (id) {
        playlist = await storage.getPlaylist(id);
        if (playlist) {
            const loaded = await Promise.all(playlist.videos.map(v => videoService.fetchVideo(v)));
            // Simple logic: Group by channel as "Modules"
            const groups: Record<string, Video[]> = {};
            loaded.forEach(v => {
                if (!groups[v.channel]) groups[v.channel] = [];
                groups[v.channel].push(v);
            });
            modules = Object.keys(groups).map(name => ({ name, videos: groups[name] }));
        }
    }
    loading = false;
  });
</script>

<Sidebar />

<main>
  {#if loading}
    <div class="loading">Generating Curriculum...</div>
  {:else if playlist}
    <header>
        <h1><Fa icon={faGraduationCap} /> {playlist.title} Curriculum</h1>
        <p>Your AI-structured learning path derived from this collection.</p>
    </header>

    <div class="curriculum-body">
        {#each modules as module}
            <section class="module">
                <div class="module-header">
                    <Fa icon={faBookOpen} />
                    <h2>Module: {module.name}</h2>
                    <span class="count">{module.videos.length} Lessons</span>
                </div>
                <div class="lesson-list">
                    {#each module.videos as video}
                        <PlaylistVideo {video} active={false} />
                    {/each}
                </div>
            </section>
        {/each}
    </div>
  {:else}
    <div class="error">Playlist not found.</div>
  {/if}
</main>

<style>
  main { padding: 3rem 6rem; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 3rem; }
  h1 { display: flex; align-items: center; gap: 1rem; margin: 0; }
  header p { color: #666; }

  .curriculum-body { display: flex; flex-direction: column; gap: 2.5rem; }
  .module { background: white; border-radius: 20px; border: 1px solid #eee; overflow: hidden; }
  .module-header { background: #f8fafc; padding: 1.5rem 2rem; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 1rem; }
  .module-header h2 { font-size: 1.2rem; margin: 0; flex: 1; }
  .count { font-size: 0.8rem; background: #e2e8f0; padding: 4px 10px; border-radius: 20px; color: #475569; font-weight: bold; }

  .lesson-list { display: flex; flex-direction: column; }
  :global(.playlist-video) { border-bottom: 1px solid #f1f5f9; }
</style>
