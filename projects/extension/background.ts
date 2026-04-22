import { storageService } from '../core/services/storage-service.js';
import { videoService } from '../core/services/video-service.js';

const playlistBuilderId = "yphPlaylistBuilder";
const playlistBuilderPageId = "yphPlaylistBuilderPage";
const addVideoToPlaylistId = "yphAddVideoToPlaylist";
const addVideoToPlaylistPageId = "yphAddVideoToPlaylistPage";
const idSep = "#";
const addVideoToPlaylistItemPrefix = `${addVideoToPlaylistId}${idSep}`;
const addVideoToPlaylistPageItemPrefix = `${addVideoToPlaylistPageId}${idSep}`;

const contextMenuIds: string[] = [];
const addVideoToPlaylistItemsContextIds: string[] = [];

// Initialize context menus
storageService.getSettings().then(buildContextMenus);

async function buildContextMenus(settings: any) {
  await clearContextMenus();

  if (!settings.disableContextBuilder) {
    chrome.contextMenus.create({
      id: playlistBuilderId,
      title: "Add video to the playlist builder",
      contexts: ["link", "video"],
    });
    chrome.contextMenus.create({
      id: playlistBuilderPageId,
      title: "Add video to the playlist builder",
      contexts: ["page"],
      documentUrlPatterns: ["https://www.youtube.com/watch*"],
    });
    contextMenuIds.push(playlistBuilderPageId);
    contextMenuIds.push(playlistBuilderId);
  }

  if (!settings.disableContextSaved) {
    chrome.contextMenus.create({
      id: addVideoToPlaylistId,
      title: "Add video to saved playlist",
      contexts: ["link", "video"],
    });
    chrome.contextMenus.create({
      id: addVideoToPlaylistPageId,
      title: "Add video to saved playlist",
      contexts: ["page"],
      documentUrlPatterns: ["https://www.youtube.com/watch*"],
    });
    contextMenuIds.push(addVideoToPlaylistId);
    contextMenuIds.push(addVideoToPlaylistPageId);
    await buildAddVideoToPlaylistItems();
  }
}

async function buildAddVideoToPlaylistItems() {
  const playlists = await storageService.getPlaylists();
  for (const playlist of playlists) {
    const contextId = `${addVideoToPlaylistItemPrefix}${playlist.id}`;
    const pageContextId = `${addVideoToPlaylistPageItemPrefix}${playlist.id}`;
    addVideoToPlaylistItemsContextIds.push(contextId);
    addVideoToPlaylistItemsContextIds.push(pageContextId);
    chrome.contextMenus.create({
      id: contextId,
      title: playlist.title,
      parentId: addVideoToPlaylistId,
    });
    chrome.contextMenus.create({
      id: pageContextId,
      title: playlist.title,
      parentId: addVideoToPlaylistPageId,
    });
  }
}

async function clearAddVideoToPlaylistItems() {
  await Promise.all(
    [...addVideoToPlaylistItemsContextIds].map(async (contextId) => {
      try { await chrome.contextMenus.remove(contextId); } catch (e) {}
    })
  );
  addVideoToPlaylistItemsContextIds.length = 0;
}

async function clearContextMenus() {
  await Promise.all(
    [...contextMenuIds, ...addVideoToPlaylistItemsContextIds].map(
      async (contextId) => {
        try { await chrome.contextMenus.remove(contextId); } catch (e) {}
      }
    )
  );
  contextMenuIds.length = 0;
  addVideoToPlaylistItemsContextIds.length = 0;
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const clickedMenuId = info.menuItemId.toString();
  try {
    if (clickedMenuId === playlistBuilderId || clickedMenuId === playlistBuilderPageId) {
      await addVideoToPlaylistBuilder(info);
    } else if (clickedMenuId.startsWith(addVideoToPlaylistItemPrefix) || clickedMenuId.startsWith(addVideoToPlaylistPageItemPrefix)) {
      await addVideoToPlaylist(info, clickedMenuId);
    }
  } catch (error: any) {
    notify(error.message);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === "get-playlist-builder") {
    fetchBuilder().then(sendResponse);
    return true;
  } else if (request.cmd === "clear-playlist-builder") {
    saveBuilder([]).then(() => {
        chrome.action.setBadgeText({ text: "" });
        sendResponse(true);
    });
    return true;
  } else if (request.cmd === "update-playlist-builder") {
    const playlistBuilder = request.playlistBuilder;
    saveBuilder(playlistBuilder).then(() => {
        chrome.action.setBadgeText({ text: "" + playlistBuilder.length });
        sendResponse(true);
    });
    return true;
  } else if (request.cmd === "focus-playlist-builder") {
    openPlaylistBuilderTab().then(() => sendResponse(true));
    return true;
  } else if (request.cmd === "update-saved-playlists") {
    clearAddVideoToPlaylistItems().then(buildAddVideoToPlaylistItems).then(() => sendResponse(true));
    return true;
  } else if (request.cmd === "create-playlist") {
    createPlaylist(request.videoIds, request.title).then(() => sendResponse(true));
    return true;
  } else if (request.cmd === "update-settings") {
    storageService.getSettings().then(buildContextMenus).then(() => sendResponse(true));
    return true;
  }
});

async function createPlaylist(videoIds: string[], title?: string) {
  if (videoIds.length === 0) return;
  const playlist = {
      id: Date.now().toString(),
      title: title || "New Playlist",
      videos: videoIds,
      timestamp: Date.now(),
      saved: true
  };
  const settings = await storageService.getSettings();
  let playlistId = playlist.id;
  if (settings.saveCreatedPlaylists) {
    playlistId = await storageService.savePlaylist(playlist as any);
  }

  if (settings.openPlaylistEditorAfterCreation) {
    const url = settings.saveCreatedPlaylists
      ? chrome.runtime.getURL(`/editor/index.html?id=${playlistId}#/editor`)
      : chrome.runtime.getURL(`/editor/index.html?videoIds=${videoIds.join(",")}#/editor`);
    await chrome.tabs.create({ url });
  }
}

async function fetchBuilder(): Promise<string[]> {
  const result = await chrome.storage.local.get(playlistBuilderId);
  return result[playlistBuilderId] || [];
}

async function saveBuilder(playlistBuilder: string[]) {
  await chrome.storage.local.set({ [playlistBuilderId]: playlistBuilder });
}

async function addVideoToPlaylistBuilder(info: chrome.contextMenus.OnClickData) {
  const videoId = parseVideoId(info);
  const playlistBuilder = await fetchBuilder();
  playlistBuilder.push(videoId);
  chrome.action.setBadgeText({ text: "" + playlistBuilder.length });
  await saveBuilder(playlistBuilder);

  const settings = await storageService.getSettings();
  if (settings.openPlaylistBuilderAfterAdd) {
    await openPlaylistBuilderTab();
  } else {
    const tabs = await getPlaylistBuilderTabs();
    tabs.forEach(tab => tab.id && chrome.tabs.reload(tab.id));
  }
}

async function addVideoToPlaylist(info: chrome.contextMenus.OnClickData, clickedMenuId: string) {
  const videoId = parseVideoId(info);
  const playlistId = clickedMenuId.split(idSep)[1];
  const playlist = await storageService.getPlaylist(playlistId);
  if (playlist) {
      playlist.videos.push(videoId);
      await storageService.savePlaylist(playlist);
      const settings = await storageService.getSettings();
      if (settings.openSavedPlaylistAfterAdd) {
          await chrome.tabs.create({
              url: chrome.runtime.getURL(`/editor/index.html?id=${playlistId}&saved=true#/editor`)
          });
      }
  }
}

function parseVideoId(info: chrome.contextMenus.OnClickData) {
  const link = info.linkUrl || info.pageUrl;
  const videoId = link && videoService.parseYoutubeId(link);
  if (!videoId) {
    throw new Error("Invalid YouTube video link: " + link);
  }
  return videoId;
}

async function getPlaylistBuilderTabs() {
  const tabs = await chrome.tabs.query({
    url: chrome.runtime.getURL(`/editor/index.html*`),
  });
  return tabs.filter(tab => tab.url && new URL(tab.url).hash.startsWith("#/playlist-builder"));
}

async function openPlaylistBuilderTab() {
  const builderTabs = await getPlaylistBuilderTabs();
  if (builderTabs.length === 0) {
    await chrome.tabs.create({
      url: chrome.runtime.getURL(`/editor/index.html#/playlist-builder`),
    });
  } else if (builderTabs[0].id) {
    await chrome.tabs.update(builderTabs[0].id, { active: true });
    if (builderTabs[0].windowId) {
        await chrome.windows.update(builderTabs[0].windowId, { focused: true });
    }
  }
}

function notify(message: string, isInfo = false) {
  chrome.notifications.create({
    type: "basic",
    title: "YouTube Playlist Helper" + (isInfo ? "" : ": Error"),
    message: message,
    iconUrl: "icons/icon_48.png",
  });
}

fetchBuilder().then(builder => {
  if (builder.length > 0) chrome.action.setBadgeText({ text: "" + builder.length });
});
