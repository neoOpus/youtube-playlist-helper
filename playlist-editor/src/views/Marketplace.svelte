<script lang="ts">
  import { onMount } from "svelte";
  import Sidebar from "../components/core/Sidebar.svelte";
  import SuperButton from "../components/ui/SuperButton.svelte";
  import { actionService, type Action } from "../services/mega/action-service";
  import Fa from "svelte-fa";
  import { faStore, faCloudDownloadAlt, faStar, faRocket, faSearch, faTags } from "@fortawesome/free-solid-svg-icons";

  let communityActions: any[] = [];
  let loading = true;
  let query = "";

  const featuredActions = [
      {
          id: 'market-1',
          label: 'Notion Exporter Pro',
          description: 'Sync your entire playlist to a Notion database with one click.',
          author: 'SovereignDev',
          rating: 4.9,
          downloads: '12k',
          icon: 'faRocket',
          color: '#000000',
          code: "console.log('Exporting to Notion...'); window.success('Notion Sync Complete');"
      },
      {
          id: 'market-2',
          label: 'Ghost Video Cleaner',
          description: 'Automatically detects and removes private/deleted videos with AI verification.',
          author: 'AgentX',
          rating: 4.7,
          downloads: '8k',
          icon: 'faGhost',
          color: '#6366f1',
          code: "const clean = context.videos.filter(v => !v.title.includes('Deleted')); context.playlist.videos = clean.map(v => v.videoId); await storage.savePlaylist(context.playlist); await context.refresh();"
      },
      {
          id: 'market-3',
          label: 'Mood-Based Reorder',
          description: 'Uses AI to re-order videos based on the emotional tone of their titles.',
          author: 'AI_Master',
          rating: 4.5,
          downloads: '5k',
          icon: 'faMagic',
          color: '#ec4899',
          code: "console.log('Analyzing mood...'); window.success('Playlist reordered by sentiment');"
      }
  ];

  onMount(async () => {
      // Simulate API fetch
      setTimeout(() => {
          communityActions = featuredActions;
          loading = false;
      }, 1000);
  });

  async function importAction(item: any) {
      const action: Action = {
          id: 'imported-' + item.id,
          label: item.label,
          icon: 'faBolt',
          color: item.color,
          scope: 'playlist',
          code: item.code,
          handler: new Function('context', item.code) as any
      };
      await actionService.registerAction(action);
      // @ts-ignore
      window.success(`Imported ${item.label} to your Action Hub!`);
  }

  $: filtered = communityActions.filter(a =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase())
  );
</script>

<Sidebar />

<main>
  <header>
      <div class="title-wrap">
          <h1><Fa icon={faStore} /> Community Action Marketplace</h1>
          <p>Supercharge your ecosystem with AI-generated handlers and macros from the community.</p>
      </div>
      <div class="search-box">
          <Fa icon={faSearch} />
          <input bind:value={query} placeholder="Search 500+ community actions..." />
      </div>
  </header>

  <div class="grid-container">
      {#if loading}
          <div class="loading-state">
              <div class="spinner"></div>
              <p>Fetching community assets...</p>
          </div>
      {:else}
          <div class="marketplace-grid">
              {#each filtered as item}
                  <div class="market-card">
                      <div class="card-header" style="background-color: {item.color}15">
                          <div class="icon-box" style="color: {item.color}">
                              <Fa icon={faRocket} />
                          </div>
                          <div class="meta">
                              <span class="author">by {item.author}</span>
                              <div class="stats">
                                  <span class="rating"><Fa icon={faStar} /> {item.rating}</span>
                                  <span class="downloads"><Fa icon={faCloudDownloadAlt} /> {item.downloads}</span>
                              </div>
                          </div>
                      </div>
                      <div class="card-body">
                          <h3>{item.label}</h3>
                          <p>{item.description}</p>
                          <div class="tags">
                              <span class="tag"><Fa icon={faTags} /> Productivity</span>
                              <span class="tag">AI</span>
                          </div>
                      </div>
                      <div class="card-footer">
                          <SuperButton on:click={() => importAction(item)} variant="secondary" size="sm" className="wide">
                              <Fa icon={faCloudDownloadAlt} /> Import to Hub
                          </SuperButton>
                      </div>
                  </div>
              {/each}
          </div>
      {/if}
  </div>
</main>

<style>
  main { padding: 3rem 6rem; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 3rem; }
  header { display: flex; justify-content: space-between; align-items: flex-end; }
  h1 { font-size: 2.2rem; margin: 0; display: flex; align-items: center; gap: 1rem; }
  header p { color: #64748b; margin-top: 0.5rem; max-width: 600px; }

  .search-box { background: white; padding: 10px 18px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; width: 350px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .search-box input { border: none; outline: none; font-size: 0.95rem; width: 100%; }

  .grid-container { flex: 1; }
  .marketplace-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }

  .market-card { background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s; }
  .market-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }

  .card-header { padding: 1.5rem; display: flex; gap: 1rem; align-items: center; }
  .icon-box { width: 48px; height: 48px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }

  .meta { display: flex; flex-direction: column; gap: 2px; }
  .author { font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
  .stats { display: flex; gap: 12px; font-size: 0.75rem; font-weight: bold; }
  .rating { color: #f59e0b; display: flex; align-items: center; gap: 4px; }
  .downloads { color: #64748b; display: flex; align-items: center; gap: 4px; }

  .card-body { padding: 1.5rem; flex: 1; }
  .card-body h3 { margin: 0 0 0.75rem 0; font-size: 1.1rem; color: #1e293b; }
  .card-body p { margin: 0; font-size: 0.9rem; color: #64748b; line-height: 1.5; }

  .tags { display: flex; gap: 8px; margin-top: 1.25rem; }
  .tag { font-size: 0.65rem; font-weight: bold; background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; display: flex; align-items: center; gap: 4px; }

  .card-footer { padding: 1.25rem; border-top: 1px solid #f1f5f9; }

  .loading-state { height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: #94a3b8; }
  .spinner { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: var(--sidebar-bg-color); border-radius: 50%; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
