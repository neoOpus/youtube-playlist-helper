<script lang="ts">
  import { stashService } from "../../services/mega/stash-service";
  import { fly, fade } from "svelte/transition";
  import SuperButton from "../ui/SuperButton.svelte";
  import Fa from "svelte-fa";
  import { faBoxOpen, faTrash, faChevronRight, faFileImport } from "@fortawesome/free-solid-svg-icons";
  import { createEventDispatcher } from "svelte";

  export let open = false;
  const stash = stashService.stashStore;
  const dispatch = createEventDispatcher();

  function removeFromStash(videoId: string) {
    stashService.removeFromStash(videoId);
  }

  function createFromStash() {
    dispatch("createPlaylist", $stash);
    stashService.clearStash();
    open = false;
  }
</script>

{#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="overlay" on:click={() => open = false} transition:fade></div>

    <div class="drawer" transition:fly={{ x: 400, duration: 300 }}>
        <header>
            <div class="title">
                <Fa icon={faBoxOpen} />
                <span>Video Stash ({$stash.length})</span>
            </div>
            <button class="close-btn" on:click={() => open = false}>
                <Fa icon={faChevronRight} />
            </button>
        </header>

        <div class="stash-content">
            {#each $stash as video}
                <div class="stash-item">
                    <img src={video.thumbnailUrl} alt={video.title} />
                    <div class="info">
                        <span class="title">{video.title}</span>
                        <span class="channel">{video.channel}</span>
                    </div>
                    <button class="remove-btn" on:click={() => removeFromStash(video.videoId)}>
                        <Fa icon={faTrash} />
                    </button>
                </div>
            {:else}
                <div class="empty-state">
                    <Fa icon={faBoxOpen} size="3x" />
                    <p>Your stash is empty. Drop videos here to organize them later.</p>
                </div>
            {/each}
        </div>

        {#if $stash.length > 0}
            <footer>
                <SuperButton on:click={createFromStash} variant="primary" className="wide">
                    <Fa icon={faFileImport} /> Create Playlist from Stash
                </SuperButton>
                <SuperButton on:click={() => stashService.clearStash()} variant="ghost" size="sm">
                    Clear Stash
                </SuperButton>
            </footer>
        {/if}
    </div>
{/if}

<style>
  .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); z-index: 2000; backdrop-filter: blur(2px); }
  .drawer { position: fixed; top: 0; right: 0; width: 380px; height: 100vh; background: white; z-index: 2001; display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.1); }

  header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
  .title { display: flex; align-items: center; gap: 12px; font-weight: bold; font-size: 1.1rem; color: #1e293b; }
  .close-btn { background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 1.2rem; }

  .stash-content { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 12px; }
  .stash-item { display: flex; gap: 12px; align-items: center; background: #f8fafc; padding: 8px; border-radius: 10px; border: 1px solid #f1f5f9; }
  .stash-item img { width: 80px; height: 45px; object-fit: cover; border-radius: 6px; }
  .info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .info .title { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .info .channel { font-size: 0.75rem; color: #64748b; }

  .remove-btn { background: none; border: none; color: #cbd5e1; cursor: pointer; transition: color 0.2s; }
  .remove-btn:hover { color: #ef4444; }

  .empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #94a3b8; padding: 2rem; gap: 1rem; }

  footer { padding: 1.5rem; border-top: 1px solid #eee; display: flex; flex-direction: column; gap: 1rem; }
  :global(.wide) { width: 100%; }
</style>
