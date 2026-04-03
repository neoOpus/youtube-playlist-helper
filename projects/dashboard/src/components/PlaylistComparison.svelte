<script lang="ts">
  import PlaylistVideo from "./PlaylistVideo.svelte";
  import { SuperButton, SearchIcon, CloseIcon } from "@yph/ui-kit";
  import type { Video, Playlist } from "@yph/core";
  import { storageService, videoService } from "@yph/core";

  let leftPlaylist: Playlist;
  let rightPlaylist: Playlist;
  let playlists: Playlist[] = [];

  storageService.getPlaylists().then(p => playlists = p);

  function transferToRight(video: Video) {
    if (rightPlaylist) {
      rightPlaylist.videos = [...rightPlaylist.videos, video.videoId];
      rightPlaylist = rightPlaylist;
    }
  }

  function transferToLeft(video: Video) {
    if (leftPlaylist) {
      leftPlaylist.videos = [...leftPlaylist.videos, video.videoId];
      leftPlaylist = leftPlaylist;
    }
  }
</script>

<main>
  <div class="comparison-container">
    <div class="column">
        <select bind:value={leftPlaylist}>
            {#each playlists as p}
                <option value={p}>{p.title}</option>
            {/each}
        </select>
        {#if leftPlaylist}
            <div class="video-list">
                <!-- Implementation details omitted for brevity, assuming standard list -->
            </div>
        {/if}
    </div>
    <div class="column">
        <select bind:value={rightPlaylist}>
            {#each playlists as p}
                <option value={p}>{p.title}</option>
            {/each}
        </select>
        {#if rightPlaylist}
             <div class="video-list">
             </div>
        {/if}
    </div>
  </div>
</main>

<style>
  .comparison-container {
    display: flex;
    gap: 20px;
  }
  .column {
    flex: 1;
  }
</style>
