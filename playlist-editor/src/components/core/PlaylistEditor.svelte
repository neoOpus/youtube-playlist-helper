<script lang="ts">
  import { replace } from "svelte-spa-router";
  import { flip } from "svelte/animate";
  import { expoOut } from "svelte/easing";
  import FloatingButton from "../ui/FloatingButton.svelte";
  import DeleteIcon from "../icons/DeleteIcon.svelte";
  import CheckIcon from "../icons/CheckIcon.svelte";
  import ClipboardMultiple from "../icons/ClipboardMultiple.svelte";
  import CloseIcon from "../icons/CloseIcon.svelte";
  import PencilIcon from "../icons/PencilIcon.svelte";
  import PlaylistPlayIcon from "../icons/PlaylistPlayIcon.svelte";
  import PlaylistPlusIcon from "../icons/PlaylistPlusIcon.svelte";
  import PlusMultiple from "../icons/PlusMultiple.svelte";
  import ReverseIcon from "../icons/ReverseIcon.svelte";
  import SaveIcon from "../icons/SaveIcon.svelte";
  import LoadingModal from "../ui/LoadingModal.svelte";
  import Modal from "../ui/Modal.svelte";
  import PlaylistVideo from "./PlaylistVideo.svelte";
  import Sidebar from "./Sidebar.svelte";
  import SimpleButton from "../ui/SimpleButton.svelte";
  import SuperCheckbox from "../ui/SuperCheckbox.svelte";
  import SuperButton from "../ui/SuperButton.svelte";
  import SuperActionHub from "../mega/SuperActionHub.svelte";
  import BulkActionBar from "../mega/BulkActionBar.svelte";
  import VideoSidebar from "../mega/VideoSidebar.svelte";
  import Logigram from "../mega/Logigram.svelte";
  import RadarChart from "../mega/RadarChart.svelte";
  import { paginate } from "svelte-paginate";
  import VirtualList from "svelte-virtual-list";
  import RemoveDuplicates from "../icons/RemoveDuplicates.svelte";
  import type { Playlist, Video } from "../../types/model";
  import PaginationNav from "./PaginationNav.svelte";
  import PlaylistTimeline from "../mega/PlaylistTimeline.svelte";
  import { playlistService } from "../../services/core/playlist-service";
  import { actionLogger } from "../../services/mega/action-logger";
  import { metadataService } from "../../services/mega/metadata-service";
  import { aiService } from "../../services/mega/ai-service";
  import { storage } from "../../services/core/storage-service";
  import { videoService } from "../../services/core/video-service";
  import Fa from "svelte-fa";
  import { faChartBar, faGraduationCap, faList, faClock, faMagic } from "@fortawesome/free-solid-svg-icons";

  enum ModalType { Export, Import }

  export let editingTitle = false;
  export let playlist: Playlist = history.state?.playlist;
  const previousPage = history.state?.previousPage || "/";
  const isNew = location.hash.startsWith("#/new");
  const isPlaylistBuilder = location.hash.startsWith("#/playlist-builder");
  let loading = true;
  let dataLoaded = false;
  let videos = [] as Video[];

  type ViewMode = "list" | "timeline" | "dashboard" | "curriculum";
  let view: ViewMode = "list";

  let selectedVideoForSidebar: Video | null = null;
  let sidebarOpen = false;

  let allSelected = false;
  $: {
    if (videos.length > 0) allSelected = videos.every((v) => v.selected);
    else allSelected = false;
  }

  let lastSelectedIndex = -1;

  function toggleSelectAll() {
    const targetValue = !allSelected;
    videos = videos.map((v) => {
      v.selected = targetValue;
      return v;
    });
  }

  function handleVideoSelect(event: CustomEvent<{ checked: boolean; shiftKey: boolean }>, index: number) {
    const isShift = event.detail.shiftKey;
    const isSelected = event.detail.checked;
    const actualIndex = (currentPage - 1) * pageSize + index;

    if (isShift && lastSelectedIndex !== -1) {
      const start = Math.min(lastSelectedIndex, actualIndex);
      const end = Math.max(lastSelectedIndex, actualIndex);
      for (let i = start; i <= end; i++) videos[i].selected = isSelected;
      videos = [...videos];
    } else {
      videos[actualIndex].selected = isSelected;
      videos = [...videos];
    }
    lastSelectedIndex = actualIndex;
  }

  async function deleteSelected() {
    const selectedVideos = videos.filter((v) => v.selected);
    const selectedCount = selectedVideos.length;
    if (selectedCount === 0) return;
    if (confirm(`Delete ${selectedCount} selected videos?`)) {
      const previousVideos = [...videos];
      actionLogger.log(`Delete ${selectedCount} videos`, () => {
        videos = previousVideos;
        loadPageVideos(currentPage);
        savePlaylistBuilder();
      });

      videos = videos.filter((v) => !v.selected);
      if (paginatedVideos.length === 0 && currentPage > 1) currentPage = Math.max(1, currentPage - 1);
      loadPageVideos(currentPage);
      await savePlaylistBuilder();
      // @ts-ignore
      window.success(`Deleted ${selectedCount} videos`);
    }
  }

  async function bulkMarkWatched(watched: boolean) {
    const selectedVideos = videos.filter((v) => v.selected);
    const previousVideos = [...videos];
    actionLogger.log(`Mark ${selectedVideos.length} as ${watched ? 'watched' : 'unwatched'}`, () => {
        videos = previousVideos;
    });
    for (const v of selectedVideos) {
      v.watched = watched;
      await metadataService.saveVideoMetadata(v.videoId, { watched });
    }
    videos = [...videos];
    // @ts-ignore
    window.success(`Updated ${selectedVideos.length} videos`);
  }

  function clearSelection() {
    videos = videos.map(v => ({ ...v, selected: false }));
  }

  async function loadPageVideos(page) {
    loading = true;
    let indicesToLoad = [];
    for (let videoIndex = (page - 1) * pageSize; videoIndex < page * pageSize && videoIndex < videos.length; videoIndex++) {
      if (videos[videoIndex].title == "") indicesToLoad.push(videoIndex);
    }
    if (indicesToLoad.length > 0) {
      const videosToLoad = indicesToLoad.map((videoIndex) => videos[videoIndex].videoId);
      const loadedVideos = await Promise.all(videosToLoad.map((videoId) => videoService.fetchVideo(videoId)));
      const videosUpdated = [...videos];
      loadedVideos.forEach((loadedVideo, loadIndex) => (videosUpdated[indicesToLoad[loadIndex]] = loadedVideo));
      videos = [...videosUpdated];
    }
    loading = false;
  }

  const possiblePageSizes = [10, 20, 30, 40, 50, 100, 500];
  const defaultPageSize = 50;
  let currentPage = 1;
  let pageSize = defaultPageSize;
  $: paginatedVideos = paginate({ items: videos, pageSize, currentPage }) as Video[];

  async function updatePaginationPage(e) {
    currentPage = e.detail.page;
    await loadPageVideos(currentPage);
  }

  async function pageSizeChanged() {
    currentPage = 1;
    await storage.set("page-size", pageSize);
    await loadPageVideos(currentPage);
  }

  (async function () {
    if (isPlaylistBuilder) {
      // @ts-ignore
      const videoIds = await browser.runtime.sendMessage({ cmd: "get-playlist-builder" });
      playlist = await videoService.generatePlaylist(videoIds);
    } else {
      const url = new URL(document.URL);
      const id = url.searchParams.get("id");
      if (id) {
        playlist = await storage.getPlaylist(id);
        history.replaceState({ playlist }, "", url.pathname + url.hash);
      } else {
        const videoIds = url.searchParams.get("videoIds");
        if (videoIds) {
          playlist = await videoService.generatePlaylist(videoIds.split(","));
          history.replaceState({ playlist }, "", url.pathname + url.hash);
        }
      }
    }
    if (!playlist) { replace("/"); return; }
    pageSize = await storage.get("page-size", defaultPageSize);
    await Promise.all(playlist.videos.map((id) => videoService.fetchVideo(id, true))).then(async (loadedVideos) => {
      videos = [...loadedVideos];
      await loadPageVideos(currentPage);
      loading = false;
      dataLoaded = true;
    });
  })();

  let hovering = -1;
  let originalTitle: string;
  let groupsString = "";
  $: if (playlist) groupsString = playlist.groups?.join(", ") || "";

  function handleGroupsChange() {
    playlist.groups = groupsString.split(",").map((s) => s.trim()).filter(Boolean);
  }

  let disableThumbnails = false;
  storage.getSettings().then((settings) => disableThumbnails = settings.disableThumbnails);

  const drop = (event, target) => {
    event.dataTransfer.dropEffect = "move";
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    target = (currentPage - 1) * pageSize + target;
    const newPlaylistVideos = [...videos];
    const [moved] = newPlaylistVideos.splice(start, 1);
    newPlaylistVideos.splice(target, 0, moved);
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
    if (paginatedVideos.length == 0 && currentPage > 1) currentPage = currentPage - 1;
    loadPageVideos(currentPage);
    await savePlaylistBuilder();
  }

  async function addVideo() {
    const url = prompt("YouTube url");
    if (!url) return;
    const videoId = videoService.parseYoutubeId(url);
    if (videoId) {
      const video = await videoService.fetchVideo(videoId);
      if (!video.dateAdded) {
        video.dateAdded = Date.now();
        await metadataService.saveVideoMetadata(video.videoId, { dateAdded: video.dateAdded });
      }
      videos = [...videos, video];
      await savePlaylistBuilder();
    } else {
      // @ts-ignore
      window.error("Invalid YouTube url");
    }
  }

  async function aiRename() {
      loading = true;
      const suggested = await aiService.suggestPlaylistTitle(videos);
      playlist.title = suggested;
      loading = false;
      // @ts-ignore
      window.success("AI Title suggested!");
  }

  async function aiCategorize() {
      loading = true;
      const suggested = await aiService.categorizePlaylist(playlist);
      playlist.groups = suggested;
      groupsString = suggested.join(", ");
      loading = false;
      // @ts-ignore
      window.success("AI Categories assigned!");
  }

  async function savePlaylist() {
    const videoIds = videos.map((video) => video.videoId.toString());
    playlist = { ...playlist, videos: videoIds };
    const id = await storage.savePlaylist(playlist);
    playlist = { ...playlist, id };
    // @ts-ignore
    if (isPlaylistBuilder) await browser.runtime.sendMessage({ cmd: "clear-playlist-builder" });
    // @ts-ignore
    window.success("Playlist saved");
    await replace("/saved");
  }

  async function savePlaylistBuilder() {
    if (isPlaylistBuilder) {
      const videoIds = videos.map((video) => video.videoId.toString());
      // @ts-ignore
      await browser.runtime.sendMessage({ cmd: "update-playlist-builder", playlistBuilder: videoIds });
    }
  }

  function play() {
    const videoIds = videos.map((video) => video.videoId.toString());
    loading = true;
    videoService.openPlaylist(videoIds).finally(() => (loading = false));
  }

  function handleVideoSidebar(video: Video) {
      selectedVideoForSidebar = video;
      sidebarOpen = true;
  }

  const customFlip: typeof flip = (node, animation, _) => flip(node, animation, { duration: 1000, easing: expoOut });

  $: stats = {
      total: videos.length,
      watched: videos.filter(v => v.watched).length,
      progress: videos.length > 0 ? (videos.filter(v => v.watched).length / videos.length) * 100 : 0,
      diversity: { "Tech": 80, "Gaming": 40, "Music": 20, "News": 60, "Education": 95 }
  };
</script>

<Sidebar />

<main class:with-sidebar={sidebarOpen}>
  {#if playlist}
    <div class="header-controls">
        <div class="title-section">
            <h2>
              {#if !editingTitle}
                <div class="title-text">{playlist.title}</div>
                <SimpleButton className="edit-title-btn" on:click={() => { originalTitle = playlist.title; editingTitle = true; }}>
                  <PencilIcon />
                </SimpleButton>
              {:else}
                <input class="edit-title-input" type="text" bind:value={playlist.title} />
                <SimpleButton on:click={() => editingTitle = false}><CheckIcon /></SimpleButton>
                <SimpleButton on:click={() => { playlist.title = originalTitle; editingTitle = false; }}><CloseIcon /></SimpleButton>
              {/if}
            </h2>
            <div class="groups-container">
              <input type="text" placeholder="Add Categories..." bind:value={groupsString} on:change={handleGroupsChange} />
              <SuperButton on:click={aiCategorize} title="AI Categorize" variant="ghost">
                  <Fa icon={faMagic} />
              </SuperButton>
            </div>
        </div>

        <div class="view-toggles">
            <button class:active={view === 'list'} on:click={() => view = 'list'} title="List View"><Fa icon={faList} /></button>
            <button class:active={view === 'timeline'} on:click={() => view = 'timeline'} title="Timeline View"><Fa icon={faClock} /></button>
            <button class:active={view === 'dashboard'} on:click={() => view = 'dashboard'} title="Insights"><Fa icon={faChartBar} /></button>
            <button class:active={view === 'curriculum'} on:click={() => view = 'curriculum'} title="Curriculum"><Fa icon={faGraduationCap} /></button>
        </div>
    </div>
  {/if}

  {#if (dataLoaded || !loading) && playlist}
    <div class="platlist-btns">
      <SuperButton on:click={play} title="Play All"><PlaylistPlayIcon /></SuperButton>
      <SuperButton on:click={addVideo} title="Add Video" variant="secondary"><PlaylistPlusIcon /></SuperButton>
      <SuperButton on:click={aiRename} title="AI Rename" bgcolor="#6f42c1"><Fa icon={faMagic} /></SuperButton>

      <div class="save-actions">
          <SuperButton on:click={savePlaylist} title="Save Playlist" variant="primary"><SaveIcon /> Save</SuperButton>
      </div>
    </div>

    <SuperActionHub scope="playlist" context={{ playlist, videos, refresh: async () => { await loadPageVideos(currentPage); } }} />

    {#if view === 'dashboard'}
        <section class="dashboard-view">
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="label">Total Videos</span>
                    <span class="value">{stats.total}</span>
                </div>
                <div class="stat-card">
                    <span class="label">Progress</span>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: {stats.progress}%"></div>
                    </div>
                    <span class="value">{stats.progress.toFixed(1)}%</span>
                </div>
            </div>
            <RadarChart data={stats.diversity} size={300} />
            <Logigram data={videos.slice(0, 12)} title="Playlist Execution Logic" on:selectVideo={(e) => handleVideoSidebar(e.detail)} />
        </section>
    {:else if view === 'curriculum'}
        <section class="curriculum-view">
            <h3>Education Path: {playlist.title}</h3>
            <div class="modules">
                {#each Array(Math.ceil(videos.length / 5)) as _, mIndex}
                    <div class="module">
                        <h4>Module {mIndex + 1}</h4>
                        <div class="module-videos">
                            {#each videos.slice(mIndex * 5, (mIndex + 1) * 5) as video}
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div
                                    class="curriculum-item"
                                    class:is-done={video.watched}
                                    on:click={() => handleVideoSidebar(video)}
                                    on:keydown={(e) => e.key === 'Enter' && handleVideoSidebar(video)}
                                    tabindex="0"
                                    role="button"
                                >
                                    <CheckIcon />
                                    <span>{video.title}</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </section>
    {:else if view === 'timeline'}
        <PlaylistTimeline {videos} />
    {:else}
      <div class="batch-controls">
        <SuperCheckbox checked={allSelected} on:change={toggleSelectAll} label="Select All" />
      </div>

      <div class="list-container" style="height: 60vh">
          {#if videos.length > 100}
              <VirtualList items={paginatedVideos} let:item>
                  <div role="button" tabindex="0" on:click={() => handleVideoSidebar(item)} on:keydown={(e) => e.key === 'Enter' && handleVideoSidebar(item)}>
                      <PlaylistVideo video={item} on:delete={deleteVideo} on:save={savePlaylistBuilder} on:select={(e) => handleVideoSelect(e, videos.indexOf(item))} active={hovering === videos.indexOf(item)} />
                  </div>
              </VirtualList>
          {:else}
              <div class="list" role="list">
                {#each paginatedVideos as video, index (video.id)}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div animate:customFlip draggable={true}
                      on:dragstart={(event) => dragstart(event, index)}
                      on:dragenter={() => (hovering = index)}
                      on:dragover|preventDefault
                      on:drop|preventDefault={(event) => drop(event, index)}
                      on:click={() => handleVideoSidebar(video)}
                      on:keydown={(e) => e.key === 'Enter' && handleVideoSidebar(video)}
                      role="button"
                      tabindex="0"
                    >
                      <PlaylistVideo on:delete={deleteVideo} on:save={savePlaylistBuilder} on:select={(e) => handleVideoSelect(e, index)} {video} {disableThumbnails} active={hovering === index} />
                    </div>
                {:else}
                    <p style="text-align: center; padding: 2rem;">Empty</p>
                {/each}
              </div>
          {/if}
      </div>
    {/if}

    <div class="pagination">
      <PaginationNav totalItems={videos.length} {pageSize} {currentPage} limit={1} showStepOptions={true} on:setPage={updatePaginationPage} />
      <select bind:value={pageSize} on:change={pageSizeChanged}>
        {#each possiblePageSizes as size}<option value={size}>{size}</option>{/each}
      </select>
    </div>
  {/if}
</main>

<VideoSidebar bind:video={selectedVideoForSidebar} bind:isOpen={sidebarOpen} on:save={savePlaylistBuilder} />

<BulkActionBar selectedCount={videos.filter((v) => v.selected).length} on:delete={deleteSelected} on:markWatched={(e) => bulkMarkWatched(e.detail)} on:clearSelection={clearSelection} />

{#if loading}<LoadingModal />{/if}

<style>
  main { padding: 0 2rem 5rem; max-width: 1400px; margin: 0 auto; transition: margin-right 0.3s ease; }
  main.with-sidebar { margin-right: 350px; }

  .header-controls { display: flex; justify-content: space-between; align-items: flex-start; padding: 2rem 0; border-bottom: 1px solid var(--border-color); margin-bottom: 2rem; }
  .title-section h2 { display: flex; align-items: center; gap: 1rem; margin: 0; font-size: 2rem; }
  .title-text { max-width: 600px; overflow: hidden; text-overflow: ellipsis; }

  .groups-container { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
  .groups-container input { border: 1px solid var(--border-color); border-radius: 4px; padding: 6px 12px; width: 300px; background: transparent; color: inherit; }

  .view-toggles { display: flex; background: rgba(0,0,0,0.05); padding: 4px; border-radius: 8px; gap: 4px; }
  .view-toggles button { background: none; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; color: #666; transition: all 0.2s; }
  .view-toggles button.active { background: white; color: var(--sidebar-bg-color); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

  .platlist-btns { display: flex; padding-bottom: 1rem; gap: 1rem; }
  .save-actions { margin-left: auto; }

  .dashboard-view { display: flex; flex-direction: column; gap: 2rem; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
  .stat-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); border: 1px solid #eee; }
  .stat-card .label { font-size: 0.8rem; color: #888; text-transform: uppercase; }
  .stat-card .value { font-size: 2.2rem; font-weight: bold; }
  .progress-container { height: 10px; background: #eee; border-radius: 5px; overflow: hidden; margin: 10px 0; }
  .progress-bar { height: 100%; background: #28a745; }

  .curriculum-view .modules { display: flex; flex-direction: column; gap: 1.5rem; }
  .module { background: white; border: 1px solid #eee; border-radius: 12px; padding: 1.5rem; }
  .curriculum-item { display: flex; align-items: center; gap: 1rem; padding: 10px; border-radius: 8px; cursor: pointer; }
  .curriculum-item:hover { background: #f8f9fa; }
  .curriculum-item.is-done { color: #28a745; opacity: 0.6; }

  .list-container { border-radius: 12px; border: 1px solid #eee; background: white; overflow: hidden; }
  .list { display: flex; flex-direction: column; }
  .batch-controls { padding-bottom: 1rem; }
  .pagination { display: flex; justify-content: center; margin-top: 3rem; gap: 1rem; align-items: center; }
  select { padding: 5px; border-radius: 4px; border: 1px solid #ddd; }
</style>
