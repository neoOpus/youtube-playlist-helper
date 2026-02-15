<script lang="ts">
  import type { Playlist } from "../../types/model";
  import PlaylistsFilters from "../core/PlaylistsFilters.svelte";
  import { replace } from "svelte-spa-router";

  export let playlists: Playlist[];
  let filteredPlaylists = playlists;

  function editPlaylist(id: string) {
    replace(`/editor?id=${id}`);
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString();
  }
</script>

{#if playlists.length > 0}
  <PlaylistsFilters bind:playlists bind:filteredPlaylists />
{/if}

<div class="advanced-selector">
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Groups</th>
        <th>Videos</th>
        <th>Created</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredPlaylists as playlist (playlist.id)}
        <tr>
          <td><button class="playlist-title-btn" on:click={() => editPlaylist(playlist.id)}>{playlist.title}</button></td>
          <td>{playlist.groups?.join(", ") || "-"}</td>
          <td>{playlist.videos.length}</td>
          <td>{formatDate(playlist.timestamp)}</td>
          <td>
            <button on:click={() => editPlaylist(playlist.id)}>Edit</button>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="5" style="text-align: center; padding: 2rem;">No playlist found</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .advanced-selector {
    width: 100%;
    overflow-x: auto;
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  th {
    background-color: rgba(0, 0, 0, 0.05);
    font-weight: bold;
  }

  .playlist-title-btn {
    color: var(--sidebar-bg-color);
    cursor: pointer;
    font-weight: bold;
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    text-align: left;
  }

  .playlist-title-btn:hover {
    text-decoration: underline;
  }

  button {
    padding: 5px 10px;
    cursor: pointer;
  }
</style>
