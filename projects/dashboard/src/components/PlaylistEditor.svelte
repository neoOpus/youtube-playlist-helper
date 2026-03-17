<script lang="ts">
  import { replace } from "svelte-spa-router";
  import { flip } from "svelte/animate";
  import { expoOut } from "svelte/easing";
  import {
    FloatingButton,
    DeleteIcon,
    CheckIcon,
    ClipboardMultiple,
    CloseIcon,
    PencilIcon,
    PlaylistPlayIcon,
    PlaylistPlusIcon,
    PlusMultiple,
    ReverseIcon,
    SaveIcon,
    RemoveDuplicates,
    SuperCheckbox,
    SimpleButton,
    TagManager,
    ResizablePanel,
    SearchIcon
  } from "@yph/ui-kit";
  import LoadingModal from "./LoadingModal.svelte";
  import Modal from "./Modal.svelte";
  import PlaylistVideo from "./PlaylistVideo.svelte";
  import { paginate } from "svelte-paginate";
  import type { Playlist, Video } from "@yph/core";
  import PaginationNav from "./PaginationNav.svelte";
  import PlaylistTimeline from "./PlaylistTimeline.svelte";
  import {
    playlistService,
    actionLogger,
    metadataService,
    videoService,
    storageService
  } from "@yph/core";

  enum ModalType {
    Export,
    Import,
  }

  export let editingTitle = false;
  export let playlist: Playlist = history.state?.playlist;
  const previousPage = history.state?.previousPage || "/";
  const isNew = location.hash.startsWith("#/new");
  const isPlaylistBuilder = location.hash.startsWith("#/playlist-builder");
  let loading = true;
  let dataLoaded = false;
  let videos = [] as Video[];
  let view: "list" | "timeline" = "list";
  let selectedVideo: Video | null = null;
  let videoFilter = "";

  let allSelected = false;
  $: {
    if (videos.length > 0) {
      allSelected = videos.every((v) => v.selected);
    } else {
      allSelected = false;
    }
  }

  function toggleSelectAll() {
    const targetValue = !allSelected;
    videos = videos.map((v) => {
      v.selected = targetValue;
      return v;
    });
  }

  async function deleteSelected() {
    const selectedCount = videos.filter((v) => v.selected).length;
    if (selectedCount === 0) return;
    if (confirm(`Delete ${selectedCount} selected videos?`)) {
      const previousVideos = [...videos];
      actionLogger.log(`Delete ${selectedCount} videos`, () => {
        videos = previousVideos;
        loadPageVideos(currentPage);
        savePlaylistBuilder();
      });

      videos = videos.filter((v) => !v.selected);
      if (paginatedVideos.length === 0 && currentPage > 1) {
        currentPage = Math.max(1, currentPage - 1);
      }
      loadPageVideos(currentPage);
      await savePlaylistBuilder();
      if ((window as any).success) (window as any).success(`Deleted ${selectedCount} videos`);
    }
  }

  async function loadPageVideos(page) {
    loading = true;
    let indicesToLoad = [];
    // Note: Filtering is handled via reactive declaration below, but we need to load meta for filtered set
    const items = filteredVideos;
    for (
      let videoIndex = (page - 1) * pageSize;
      videoIndex < page * pageSize && videoIndex < items.length;
      videoIndex++
    ) {
      if (items[videoIndex].title == "") {
        // Find index in original videos array
        const originalIndex = videos.findIndex(v => v.videoId === items[videoIndex].videoId);
        if (originalIndex !== -1) indicesToLoad.push(originalIndex);
      }
    }
    if (indicesToLoad.length > 0) {
      const videosToLoad = indicesToLoad.map(
        (videoIndex) => videos[videoIndex].videoId
      );
      const loadedVideos = await Promise.all(
        videosToLoad.map((videoId) => videoService.fetchVideo(videoId))
      );
      const videosUpdated = [...videos];
      loadedVideos.forEach(
        (loadedVideo, loadIndex) =>
          (videosUpdated[indicesToLoad[loadIndex]] = loadedVideo)
      );
      videos = [...videosUpdated];
    }
    loading = false;
  }

  const possiblePageSizes = [10, 20, 30, 40, 50];
  const defaultPageSize = 50;
  let currentPage = 1;
  let pageSize = defaultPageSize;

  $: filteredVideos = videoFilter.trim()
    ? videos.filter(v => v.title.toLowerCase().includes(videoFilter.toLowerCase()) || v.channel.toLowerCase().includes(videoFilter.toLowerCase()))
    : videos;

  $: paginatedVideos = paginate({
    items: filteredVideos,
    pageSize,
    currentPage,
  }) as Video[];

  async function updatePaginationPage(e) {
    currentPage = e.detail.page;
    await loadPageVideos(currentPage);
  }

  async function pageSizeChanged() {
    currentPage = 1;
    await storageService.storeObject("page-size", pageSize);
    await loadPageVideos(currentPage);
  }

  (async function () {
    if (isPlaylistBuilder) {
      const videoIds = await (typeof browser !== 'undefined' ? browser.runtime.sendMessage({
        cmd: "get-playlist-builder",
      }) : []);
      playlist = await videoService.generatePlaylist(videoIds);
    } else {
      const url = new URL(document.URL);
      const id = url.searchParams.get("id");
      if (id) {
        playlist = await storageService.getPlaylist(id);
        history.replaceState({ playlist }, "", url.pathname + url.hash);
      } else {
        const videoIds = url.searchParams.get("videoIds");
        if (videoIds) {
          playlist = await videoService.generatePlaylist(videoIds.split(","));
          history.replaceState({ playlist }, "", url.pathname + url.hash);
        }
      }
    }
    if (!playlist) {
      replace("/");
      return;
    }

    pageSize = await storageService.fetchObject("page-size", defaultPageSize);
    await Promise.all(
      playlist.videos.map((id) => videoService.fetchVideo(id, true))
    ).then(async (loadedVideos) => {
      videos = [...loadedVideos];
      await loadPageVideos(currentPage);
      loading = false;
      dataLoaded = true;
    });
  })();

  let hovering = -1;
  let originalTitle: string;
  let groups: string[] = [];
  $: {
    if (playlist) {
      groups = playlist.groups || [];
    }
  }

  function handleGroupsChange(event: CustomEvent<string[]>) {
    const previousGroups = [...(playlist.groups || [])];
    const newGroups = event.detail;
    actionLogger.log("Change groups", () => {
      playlist.groups = previousGroups;
      groups = [...previousGroups];
    });
    playlist.groups = newGroups;
  }

  let displayModal = false;
  let modalType: ModalType;
  let importText = "";
  let exportText = "";
  let notificationText = "";
  let exportTextArea: HTMLTextAreaElement;

  let disableThumbnails = true;
  storageService.getSettings().then((settings) => {
    disableThumbnails = settings.disableThumbnails;
  });

  const drop = (event, target) => {
    event.dataTransfer.dropEffect = "move";
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    target = (currentPage - 1) * pageSize + target;
    const newPlaylistVideos = videos;

    if (start < target) {
      newPlaylistVideos.splice(target + 1, 0, newPlaylistVideos[start]);
      newPlaylistVideos.splice(start, 1);
    } else {
      newPlaylistVideos.splice(target, 0, newPlaylistVideos[start]);
      newPlaylistVideos.splice(start + 1, 1);
    }
    videos = newPlaylistVideos;
    hovering = -1;
  };

  const dragstart = (event, i) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    const start = (currentPage - 1) * pageSize + i;
    event.dataTransfer.setData("text/plain", start);
  };

  async function deleteVideo(event: CustomEvent<Video>) {
    const previousVideos = [...videos];
    actionLogger.log(`Delete video`, () => {
      videos = previousVideos;
      loadPageVideos(currentPage);
      savePlaylistBuilder();
    });

    videos = videos.filter((video) => video.id !== event.detail.id);
    if (paginatedVideos.length == 0 && currentPage > 1) {
      currentPage = currentPage - 1;
    }
    loadPageVideos(currentPage);
    await savePlaylistBuilder();
  }

  async function addVideo() {
    const url = prompt("YouTube url");
    if (!url) {
      return;
    }
    const videoId = videoService.parseYoutubeId(url);
    if (videoId) {
      const video = await videoService.fetchVideo(videoId);
      if (!video.dateAdded) {
        video.dateAdded = Date.now();
        await metadataService.saveVideoMetadata(video.videoId, {
          dateAdded: video.dateAdded,
        });
      }
      videos = [...videos, video];
      await savePlaylistBuilder();
    } else {
       if ((window as any).error) (window as any).error("Invalid YouTube url");
    }
  }

  async function importVideos() {
    loading = true;
    let importedVideos = await Promise.all(
      videoService
        .parseYoutubeIds(importText)
        .map((id) => videoService.fetchVideo(id))
    );
    importedVideos = importedVideos.filter((v) => v != null);
    for (const v of importedVideos) {
      if (!v.dateAdded) {
        v.dateAdded = Date.now();
        await metadataService.saveVideoMetadata(v.videoId, {
          dateAdded: v.dateAdded,
        });
      }
    }
    videos = [...videos, ...importedVideos];
    await savePlaylistBuilder();
    importText = "";
    displayModal = false;
    loading = false;
    setTimeout(
      () => { if ((window as any).success) (window as any).success(`Imported ${importedVideos.length} videos`) },
      100
    );
  }

  async function exportVideos() {
    exportTextArea.select();
    exportTextArea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    notificationText = "Copied !";
    setTimeout(() => (notificationText = ""), 2000);
  }

  async function displayImport() {
    displayModal = true;
    modalType = ModalType.Import;
  }

  function displayExport() {
    displayModal = true;
    exportText = videos.map((v) => v.url).join("\n");
    modalType = ModalType.Export;
  }

  async function reversePlaylist() {
    const previousVideos = [...videos];
    actionLogger.log("Reverse playlist", () => {
      videos = previousVideos;
      loadPageVideos(currentPage);
      savePlaylistBuilder();
    });

    let reversed = new Array(videos.length);
    for (let i = 0; i < videos.length; i++) {
      let r = videos.length - i - 1;
      reversed[i] = videos[r];
    }
    videos = reversed;
    loadPageVideos(currentPage);
    await savePlaylistBuilder();
  }

  async function removeDuplicates() {
    const { uniqueVideos, duplicatesCount } =
      playlistService.removeDuplicates(videos);

    if (duplicatesCount > 0) {
      const previousVideos = [...videos];
      actionLogger.log(`Remove ${duplicatesCount} duplicates`, () => {
        videos = previousVideos;
        loadPageVideos(currentPage);
        savePlaylistBuilder();
      });

      videos = uniqueVideos;
      loadPageVideos(currentPage);
      await savePlaylistBuilder();
      setTimeout(
        () => { if ((window as any).success) (window as any).success(`Removed ${duplicatesCount} duplicates`) },
        200
      );
    } else {
      if ((window as any).info) (window as any).info("No duplicates found");
    }
  }

  async function savePlaylist() {
    const videoIds = videos.map((video) => video.videoId.toString());
    playlist = { ...playlist, videos: videoIds };
    const id = await storageService.savePlaylist(playlist);
    playlist = { ...playlist, id };
    if (isPlaylistBuilder) {
      if (typeof browser !== 'undefined') {
        await browser.runtime.sendMessage({
            cmd: "clear-playlist-builder",
        });
      }
    }
    if ((window as any).success) (window as any).success("Playlist saved");
    await replace("/saved");
  }

  async function savePlaylistBuilder() {
    if (isPlaylistBuilder) {
      const videoIds = videos.map((video) => video.videoId.toString());
      if (typeof browser !== 'undefined') {
        await browser.runtime.sendMessage({
            cmd: "update-playlist-builder",
            playlistBuilder: videoIds,
        });
      }
    }
  }

  async function clearPlaylistBuilder() {
    if (isPlaylistBuilder) {
      videos = [];
      if (typeof browser !== 'undefined') {
        await browser.runtime.sendMessage({
            cmd: "clear-playlist-builder",
        });
      }
    }
  }

  async function deletePlaylist() {
    if (confirm("The playlist is about to be deleted")) {
      await storageService.removePlaylist(playlist);
      await replace(previousPage);
    }
  }

  function play() {
    const videoIds = videos.map((video) => video.videoId.toString());
    loading = true;
    videoService.openPlaylist(videoIds).finally(() => (loading = false));
  }

  function startTitleEdit() {
    originalTitle = playlist.title;
    editingTitle = true;
  }
  function resetTitle() {
    playlist.title = originalTitle;
    endTitleEdit();
  }
  function endTitleEdit() {
    const newTitle = playlist.title;
    if (newTitle !== originalTitle) {
        const prevTitle = originalTitle;
        actionLogger.log("Change title", () => {
            playlist.title = prevTitle;
        });
    }
    originalTitle = null;
    editingTitle = false;
  }
  const customFlip: typeof flip = (node, animation, _) => {
    return flip(node, animation, {
      duration: 1000,
      easing: expoOut,
    });
  };

  function selectVideo(video: Video) {
      selectedVideo = video;
  }
</script>

<main class="editor-main">
  <div class="editor-header glass">
      {#if playlist}
        <div class="title-section">
            <h2>
              {#if !editingTitle}
                <div class="title-text">{playlist.title}</div>
                <button class="icon-btn" on:click={startTitleEdit}>
                  <PencilIcon size="16" />
                </button>
              {:else}
                <input
                  class="edit-title-input"
                  type="text"
                  bind:value={playlist.title}
                  on:keydown={(e) => e.key === 'Enter' && endTitleEdit()}
                />
                <button class="icon-btn success" on:click={endTitleEdit}><CheckIcon size="16" /></button>
                <button class="icon-btn danger" on:click={resetTitle}><CloseIcon size="16" /></button>
              {/if}
            </h2>
            <div class="groups-container">
              <TagManager tags={groups} on:change={handleGroupsChange} />
            </div>
        </div>
      {/if}
  </div>

  <div class="editor-body">
    <ResizablePanel width={320} minWidth={250} maxWidth={500}>
        <div class="sidebar-info">
            <div class="summary-card">
                <h3>Playlist Summary</h3>
                <div class="stats-grid">
                    <div class="stat">
                        <span class="label">VIDEOS</span>
                        <span class="value">{videos.length}</span>
                    </div>
                    <div class="stat">
                        <span class="label">WATCHED</span>
                        <span class="value">{videos.filter(v => v.watched).length}</span>
                    </div>
                </div>
                <div class="quick-actions-v">
                    <button class="btn primary" on:click={play}>
                        <PlaylistPlayIcon size="18" /> Play All
                    </button>
                    <button class="btn secondary" on:click={removeDuplicates}>
                        <RemoveDuplicates size="18" /> Clean Duplicates
                    </button>
                    <button class="btn secondary" on:click={reversePlaylist}>
                        <ReverseIcon size="18" /> Reverse Order
                    </button>
                </div>
            </div>

            <div class="filter-section">
                <p class="section-label">QUICK FILTER</p>
                <div class="search-input-wrapper">
                    <SearchIcon size="14" color="var(--text-muted)" />
                    <input type="text" bind:value={videoFilter} placeholder="Filter videos..." />
                </div>
            </div>
        </div>
    </ResizablePanel>

    <div class="video-list-container">
        {#if (dataLoaded || !loading) && playlist}
            <div class="platlist-btns">
              {#if videos.some((v) => v.selected)}
                <FloatingButton
                  on:click={deleteSelected}
                  title="Delete selected"
                  bgcolor="#dc3545"><DeleteIcon /></FloatingButton
                >
              {/if}
              <FloatingButton on:click={addVideo} title="Add video"
                ><PlaylistPlusIcon /></FloatingButton
              >
              <FloatingButton on:click={displayImport} title="Import videos"
                ><PlusMultiple /></FloatingButton
              >
              <FloatingButton
                on:click={() => (view = view === "list" ? "timeline" : "list")}
                title={view === "list" ? "View timeline" : "View list"}
                ><ReverseIcon /></FloatingButton
              >
              {#if videos.length > 0}
                <FloatingButton on:click={displayExport} title="Export videos"
                  ><ClipboardMultiple /></FloatingButton
                >
                <FloatingButton
                  on:click={savePlaylist}
                  title="Save the playlist"
                  bgcolor="var(--primary)"><SaveIcon /></FloatingButton
                >
              {/if}
            </div>

            {#if videos.length > 0 && view === "list"}
              <div class="batch-controls">
                <SuperCheckbox
                  checked={allSelected}
                  on:change={toggleSelectAll}
                  label="Select All"
                />
                {#if videoFilter}
                    <span class="filter-status">Showing {filteredVideos.length} of {videos.length} videos</span>
                {/if}
              </div>
            {/if}

            {#if view === "timeline"}
              <PlaylistTimeline videos={filteredVideos} />
            {:else}
              <div class="list">
                {#each paginatedVideos as video, index (video.id)}
                <div
                  animate:customFlip
                  draggable={true} role="listitem"
                  on:dragstart={(event) => dragstart(event, index)}
                  on:dragenter={() => (hovering = index)}
                  on:dragover|preventDefault
                  on:drop|preventDefault={(event) => drop(event, index)}
                >
                  <PlaylistVideo
                    on:delete={deleteVideo}
                    on:save={savePlaylistBuilder}
                    on:click={() => selectVideo(video)}
                    {video}
                    {disableThumbnails}
                    active={hovering === index}
                  />
                </div>
              {:else}
                <div class="empty-state">
                    <p>{videoFilter ? 'No videos match your filter.' : 'The playlist is empty.'}</p>
                </div>
                {/each}
              </div>
            {/if}

            <div class="pagination">
              {#if filteredVideos.length > pageSize}
                <PaginationNav
                  totalItems={filteredVideos.length}
                  {pageSize}
                  {currentPage}
                  limit={1}
                  showStepOptions={true}
                  on:setPage={updatePaginationPage}
                />
              {/if}
              {#if filteredVideos.length > 0}
                <select bind:value={pageSize} on:change={pageSizeChanged} class="page-size-select">
                  {#each possiblePageSizes as size}
                    <option value={size}>{size}</option>
                  {/each}
                </select>
              {/if}
            </div>
        {/if}
    </div>
  </div>
</main>

<Modal bind:display={displayModal}>
  {#if modalType === ModalType.Export}
    <div class="modal-content">
        <h3>Export Video URLs</h3>
        <textarea bind:value={exportText} bind:this={exportTextArea} readonly></textarea>
        <div class="modal-actions">
            <button class="btn primary" on:click={exportVideos}>
                <ClipboardMultiple size="16" /> {notificationText || 'Copy to Clipboard'}
            </button>
        </div>
    </div>
  {:else if modalType === ModalType.Import}
    <div class="modal-content">
        <h3>Import Videos</h3>
        <p class="hint">Paste YouTube URLs or IDs (one per line)</p>
        <textarea bind:value={importText} placeholder="https://youtube.com/watch?v=..."></textarea>
        <div class="modal-actions">
            <button class="btn primary" on:click={importVideos}>
                <PlusMultiple size="16" /> Import Videos
            </button>
        </div>
    </div>
  {/if}
</Modal>

{#if loading}
  <LoadingModal />
{/if}

<style>
  .editor-main {
      width: 100%;
      display: flex;
      flex-direction: column;
      height: 100vh;
      margin: 0;
      padding: 0;
      background: transparent;
  }

  .editor-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border);
  }

  .title-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
  }

  .title-text {
      font-weight: 900;
      font-size: 1.75rem;
      letter-spacing: -0.5px;
  }

  .editor-body {
      display: flex;
      flex-grow: 1;
      overflow: hidden;
  }

  .sidebar-info {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
  }

  .summary-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 4px 12px var(--shadow);
  }

  .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin: 1rem 0 1.5rem;
  }

  .stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
  }

  .stat .label {
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--text-muted);
  }

  .stat .value {
      font-size: 1.25rem;
      font-weight: 900;
      font-family: 'JetBrains Mono', monospace;
  }

  .quick-actions-v {
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid var(--border);
      transition: all 0.2s;
  }

  .btn.primary { background: var(--primary); color: white; border-color: var(--primary); }
  .btn.secondary { background: var(--hover); color: var(--text); }

  .filter-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
  }

  .section-label {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 1px;
  }

  .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0 12px;
  }

  .search-input-wrapper input {
      border: none;
      background: transparent;
      padding: 10px 0;
      width: 100%;
      outline: none;
      font-size: 0.9rem;
  }

  .video-list-container {
      flex-grow: 1;
      overflow-y: auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
  }

  h2 {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .edit-title-input {
    text-align: center;
    font-weight: 900;
    font-size: 1.5rem;
    border: 2px solid var(--primary);
    border-radius: 8px;
    padding: 4px 12px;
  }

  .icon-btn {
      background: var(--hover);
      border: 1px solid var(--border);
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
  }

  .icon-btn.success { color: #28a745; border-color: #28a745; }
  .icon-btn.danger { color: #dc3545; border-color: #dc3545; }

  .platlist-btns {
    display: flex;
    padding-bottom: 2rem;
    gap: 12px;
  }

  .batch-controls {
    padding-bottom: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .filter-status {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
  }

  .list {
    width: 100%;
    background: var(--card-bg);
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 20px var(--shadow);
    overflow: hidden;
  }

  .list > div:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }

  .empty-state {
      padding: 4rem;
      text-align: center;
      color: var(--text-muted);
      font-style: italic;
  }

  textarea {
    width: 100%;
    height: 40vh;
    border-radius: 8px;
    padding: 1rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    background: var(--hover);
    color: var(--text);
  }

  .modal-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
  }

  .hint { font-size: 0.8rem; color: var(--text-muted); }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding-top: 2rem;
  }

  .page-size-select {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8rem;
  }
</style>
