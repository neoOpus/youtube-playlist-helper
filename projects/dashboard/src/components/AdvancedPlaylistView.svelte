<script lang="ts">
  import type { Playlist } from "@yph/core";
  import PlaylistsFilters from "./PlaylistsFilters.svelte";
  import { replace } from "svelte-spa-router";

  export let playlists: Playlist[];
  let filteredPlaylists = playlists;

  let sortColumn = "timestamp";
  let sortDirection = -1; // -1 for desc, 1 for asc

  function editPlaylist(id: string) {
    replace(`/editor?id=${id}`);
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString();
  }

  function sortBy(column: string) {
    if (sortColumn === column) {
      sortDirection *= -1;
    } else {
      sortColumn = column;
      sortDirection = column === "title" ? 1 : -1;
    }

    filteredPlaylists = [...filteredPlaylists].sort((a, b) => {
      let valA, valB;
      if (column === "videos") {
        valA = a.videos.length;
        valB = b.videos.length;
      } else {
        valA = a[column];
        valB = b[column];
      }

      if (valA < valB) return -1 * sortDirection;
      if (valA > valB) return 1 * sortDirection;
      return 0;
    });
  }

  $: {
      filteredPlaylists = playlists;
      sortBy(sortColumn);
  }
</script>

{#if playlists.length > 0}
  <PlaylistsFilters bind:playlists bind:filteredPlaylists />
{/if}

<div class="advanced-selector">
  <table>
    <thead>
      <tr>
        <th on:click={() => sortBy("title")} class:sorted={sortColumn === "title"}>
            Title {sortColumn === "title" ? (sortDirection === 1 ? "↑" : "↓") : ""}
        </th>
        <th>Groups</th>
        <th on:click={() => sortBy("videos")} class:sorted={sortColumn === "videos"}>
            Videos {sortColumn === "videos" ? (sortDirection === 1 ? "↑" : "↓") : ""}
        </th>
        <th on:click={() => sortBy("timestamp")} class:sorted={sortColumn === "timestamp"}>
            Created {sortColumn === "timestamp" ? (sortDirection === 1 ? "↑" : "↓") : ""}
        </th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredPlaylists as playlist (playlist.id)}
        <tr>
          <td>
            <div class="title-cell">
                <button class="playlist-title-btn" on:click={() => editPlaylist(playlist.id)}>{playlist.title}</button>
            </div>
          </td>
          <td>
            <div class="groups-cell">
                {#each playlist.groups || [] as group}
                    <span class="group-tag">{group}</span>
                {:else}
                    <span class="no-groups">-</span>
                {/each}
            </div>
          </td>
          <td>{playlist.videos.length}</td>
          <td>{formatDate(playlist.timestamp)}</td>
          <td>
            <button class="action-btn" on:click={() => editPlaylist(playlist.id)}>Edit</button>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="5" style="text-align: center; padding: 3rem;">
            <div class="empty-state">
                <p>No playlists found matching your filters.</p>
            </div>
          </td>
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
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  th {
    background-color: rgba(0, 0, 0, 0.03);
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  th:hover {
    background-color: rgba(0, 0, 0, 0.07);
  }

  th.sorted {
    color: var(--sidebar-bg-color);
    background-color: rgba(0, 0, 0, 0.05);
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .title-cell {
    font-weight: bold;
  }

  .playlist-title-btn {
    color: var(--sidebar-bg-color);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    text-align: left;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .playlist-title-btn:hover {
    text-decoration: underline;
  }

  .groups-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .group-tag {
    background: var(--sidebar-bg-color);
    color: white;
    font-size: 0.75rem;
    padding: 1px 6px;
    border-radius: 10px;
  }

  .no-groups {
    color: #999;
  }

  .action-btn {
    padding: 6px 12px;
    cursor: pointer;
    background: var(--sidebar-bg-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  .action-btn:hover {
    opacity: 0.9;
  }

  .empty-state {
    color: #666;
    font-style: italic;
  }
</style>
