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
    ResizablePanel
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
    storageService,
    aiService
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
    for (
      let videoIndex = (page - 1) * pageSize;
      videoIndex < page * pageSize && videoIndex < videos.length;
      videoIndex++
    ) {
      if (videos[videoIndex].title == "") {
        indicesToLoad.push(videoIndex);
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
  $: paginatedVideos = paginate({
    items: videos,
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

  let suggestingGroups = false;
  let suggestedGroups: string[] = [];
  let showAIGroupsModal = false;

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

  async function handleMoveVideo(event: CustomEvent<{ direction: "top" | "bottom", video: Video }>) {
    const { direction, video } = event.detail;
    const index = videos.findIndex(v => v.id === video.id);
    if (index === -1) return;

    const previousVideos = [...videos];
    actionLogger.log(`Move video to ${direction}`, () => {
        videos = previousVideos;
        loadPageVideos(currentPage);
        savePlaylistBuilder();
    });

    const newVideos = [...videos];
    newVideos.splice(index, 1);
    if (direction === "top") {
        newVideos.unshift(video);
        currentPage = 1;
    } else {
        newVideos.push(video);
        currentPage = Math.ceil(newVideos.length / pageSize);
    }
    videos = newVideos;
    loadPageVideos(currentPage);
    await savePlaylistBuilder();
  }

  function selectVideo(video: Video) {
      selectedVideo = video;
  }

  async function suggestGroups() {
      suggestingGroups = true;
      try {
          suggestedGroups = await aiService.suggestPlaylistGroups(videos);
          showAIGroupsModal = true;
      } catch (e) {
          if ((window as any).error) (window as any).error("AI analysis failed");
      } finally {
          suggestingGroups = false;
      }
  }

  function applyAIGroups() {
      const currentGroups = new Set(playlist.groups || []);
      suggestedGroups.forEach(g => currentGroups.add(g));

      const previousGroups = [...(playlist.groups || [])];
      const newGroups = Array.from(currentGroups);

      actionLogger.log("Apply AI Categories", () => {
          playlist.groups = previousGroups;
          groups = [...previousGroups];
      });

      playlist.groups = newGroups;
      groups = [...newGroups];
      showAIGroupsModal = false;
      if ((window as any).success) (window as any).success(`Added ${newGroups.length - previousGroups.length} categories`);
  }
</script>

<main class="editor-main">
  <div class="editor-header">
      {#if playlist}
        <h2>
          {#if !editingTitle}
            <div style="line-height: 40px;">{playlist.title}</div>
            <SimpleButton className="edit-title-btn" on:click={startTitleEdit}>
              <PencilIcon />
            </SimpleButton>
          {:else}
            <input
              class="edit-title-input"
              type="text"
              bind:value={playlist.title}
            />
            <SimpleButton on:click={endTitleEdit}><CheckIcon /></SimpleButton>
            <SimpleButton on:click={resetTitle}><CloseIcon /></SimpleButton>
          {/if}
        </h2>
        <div class="groups-container">
          <span>Groups:</span>
          <TagManager tags={groups} on:change={handleGroupsChange} />
        </div>
      {/if}
  </div>

  <div class="editor-body">
    <ResizablePanel width={350} minWidth={250} maxWidth={600}>
        <div class="sidebar-info">
            <h3>Playlist Summary</h3>
            <p>Total Videos: {videos.length}</p>
            <p>Watched: {videos.filter(v => v.watched).length}</p>
            <div class="quick-actions">
                <button on:click={play}>Play All</button>
                <button on:click={removeDuplicates}>Clean Dups</button>
                <button on:click={suggestGroups} disabled={suggestingGroups}>
                    {suggestingGroups ? 'Analyzing...' : 'Magic Categories ✨'}
                </button>
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
                  bgcolor="#28a745"><SaveIcon /></FloatingButton
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
              </div>
            {/if}

            {#if view === "timeline"}
              <PlaylistTimeline {videos} />
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
                    on:move={handleMoveVideo}
                    on:click={() => selectVideo(video)}
                    {video}
                    {disableThumbnails}
                    active={hovering === index}
                  />
                </div>
              {:else}
                <p style="text-align: center">The playlist is empty</p>
                {/each}
              </div>
            {/if}

            <div class="pagination">
              {#if videos.length > pageSize}
                <PaginationNav
                  totalItems={videos.length}
                  {pageSize}
                  {currentPage}
                  limit={1}
                  showStepOptions={true}
                  on:setPage={updatePaginationPage}
                />
              {/if}
              {#if videos.length > 0}
                <select bind:value={pageSize} on:change={pageSizeChanged}>
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
    <textarea bind:value={exportText} bind:this={exportTextArea}></textarea>
    <FloatingButton on:click={exportVideos} title="Copy to clipboard"
      ><ClipboardMultiple /></FloatingButton
    >
    <span style="margin-left: 1rem">{notificationText}</span>
  {:else if modalType === ModalType.Import}
    <textarea bind:value={importText}></textarea>
    <FloatingButton on:click={importVideos} title="Import videos"
      ><PlusMultiple /></FloatingButton
    >
  {/if}
</Modal>

<Modal bind:display={showAIGroupsModal}>
  <h3>AI Suggested Categories</h3>
  <p>Based on your videos, we suggest adding these tags to organize your playlist:</p>
  <div class="suggested-tags">
      {#each suggestedGroups as tag}
          <span class="tag-suggestion">
              {tag}
              <button class="remove-suggestion" on:click={() => suggestedGroups = suggestedGroups.filter(t => t !== tag)}>×</button>
          </span>
      {/each}
      {#if suggestedGroups.length === 0}
          <p>No suggestions found or all removed.</p>
      {/if}
  </div>
  <div class="modal-actions">
      <button class="apply-btn" on:click={applyAIGroups} disabled={suggestedGroups.length === 0}>Apply to Playlist</button>
      <button class="cancel-btn" on:click={() => showAIGroupsModal = false}>Cancel</button>
  </div>
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
  }

  .editor-header {
      padding: 1rem 2rem;
      border-bottom: 1px solid var(--border-color);
  }

  .editor-body {
      display: flex;
      flex-grow: 1;
      overflow: hidden;
  }

  .sidebar-info {
      padding: 20px;
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
    justify-content: center;
    width: 100%;
    font-size: 24px;
    margin-bottom: 5px;
  }

  .edit-title-input {
    width: 100%;
    text-align: center;
    margin: 0;
    margin-right: 5px;
    padding: 0;
    font-weight: bold;
  }

  :global(.edit-title-btn) {
    margin-left: 20px;
  }

  .groups-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
  }

  .platlist-btns {
    display: flex;
    padding-bottom: 20px;
    gap: 10px;
  }

  .batch-controls {
    padding-bottom: 10px;
    width: 100%;
    display: flex;
  }

  .list {
    width: 100%;
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }

  .list > div:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }

  textarea {
    min-width: 30rem;
    height: 50vh;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
  }

  .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
  }

  .quick-actions button {
      padding: 10px;
      background: var(--sidebar-bg-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
  }

  .quick-actions button:hover:not(:disabled) {
      background: #444;
  }

  .quick-actions button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
  }

  .suggested-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 20px 0;
      min-height: 40px;
  }

  .tag-suggestion {
      background: #eee;
      padding: 5px 12px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
  }

  .remove-suggestion {
      border: none;
      background: none;
      cursor: pointer;
      font-weight: bold;
      color: #888;
      padding: 0;
      line-height: 1;
  }

  .remove-suggestion:hover {
      color: #f44336;
  }

  .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
  }

  .apply-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
  }

  .apply-btn:disabled {
      background: #ccc;
  }

  .cancel-btn {
      background: #eee;
      border: 1px solid #ccc;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
  }
</style>
