import { storageService, videoService } from "@yph/core";

// Theme handling
(async () => {
    const settings = await storageService.getSettings();
    let theme = settings.themeChoice;
    if (theme === "device") {
        theme = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.dataset.theme = theme;
})();

/***********************************
 *               UI
 ***********************************/

const getById = (id: string) => document.getElementById(id) as HTMLElement;
const queryAll = (selector: string) => document.querySelectorAll(selector);

getById("open-editor").onclick = async () => {
  const settings = await storageService.getSettings();
  chrome.tabs.create({
    url: chrome.runtime.getURL(`/editor/index.html#${settings.defaultEditorPage}`),
  });
  window.close();
};

getById("from-bookmark").onclick = () => {
  const container = getById("bookmarks");
  container.innerHTML = "";
  getYoutubeFolderBookmarks().then((bookmarks) => {
    if (bookmarks.length === 0) {
      const div = document.createElement("div");
      div.textContent = "No folder containing YouTube links found";
      div.style.textAlign = "center";
      div.style.padding = "10px";
      container.append(div);
    }
    bookmarks.forEach((folder) => {
      const div = document.createElement("div");
      div.textContent = folder.folderName;
      div.className = "menu-item";
      div.onclick = () => {
        createPlaylist(folder.videoIds, folder.folderName.split('/').pop());
        setTimeout(() => window.close(), 10);
      };
      container.append(div);
    });
    activatePopupMenu("from-bookmark-menu");
  });
};

getById("from-builder").onclick = async () => {
  chrome.runtime.sendMessage({ cmd: "focus-playlist-builder" });
  window.close();
};

getById("from-urls").onclick = () => activatePopupMenu("from-urls-menu");
getById("combine-tabs").onclick = () => activatePopupMenu("combine-tabs-menu");

getById("combine-tabs-exclude-playlists").onclick = async () => {
  let tabs = await getCurrentYoutubeTabs(false);
  if (tabs.length > 0) {
    const videoIds = tabs.map((tab) => videoService.parseYoutubeId(tab.url || "")).filter(Boolean) as string[];
    const settings = await storageService.getSettings();
    if (settings.closeAfterCombine) closeTabs(tabs);
    createPlaylist(videoIds);
  } else {
    notify("There are no valid YouTube video tabs in the current window");
  }
  window.close();
};

getById("from-current-links").onclick = async () => {
  let body = await getCurrentTabBody();
  let videoIds = [...parseYoutubeLinks(body), ...parseYoutubeThumbnailIds(body)];
  videoIds = Array.from(new Set(videoIds));
  if (videoIds.length > 0) {
    createPlaylist(videoIds);
  } else {
    notify("No YouTube video link found in the current tab");
  }
  window.close();
};

getById("open-settings").onclick = async () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("/options/options.html") });
  window.close();
};

getById("open-support").onclick = async () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("/editor/index.html#/support") });
  window.close();
};

queryAll(".back-item").forEach((item) => {
  (item as HTMLElement).onclick = () => activatePopupMenu("main-menu");
});

getById("create-from-urls").onclick = () => {
    const text = (getById("urlsTextarea") as HTMLTextAreaElement).value;
    const videoIds = videoService.parseYoutubeIds(text);
    createPlaylist(videoIds);
    window.close();
};

function activatePopupMenu(menuId: string) {
  queryAll(".popup-menu").forEach((menu) => {
    (menu as HTMLElement).style.display = "none";
  });
  getById(menuId).style.display = "block";
}

/***********************************
 *            Bookmarks
 ***********************************/

async function getYoutubeFolderBookmarks() {
  const tree = await chrome.bookmarks.getTree();
  return recursiveCollectBookmarks("", tree);
}

function recursiveCollectBookmarks(parentFolder: string, tree: chrome.bookmarks.BookmarkTreeNode[]) {
  let bookmarks: { folderName: string, videoIds: string[] }[] = [];
  if (!tree) return bookmarks;

  let currentFolderVideoIds: string[] = [];

  tree.forEach((node) => {
    if (node.children && node.children.length > 0) {
      bookmarks.push(...recursiveCollectBookmarks(parentFolder + node.title + "/", node.children));
    } else if (node.url) {
      const videoId = videoService.parseYoutubeId(node.url);
      if (videoId) currentFolderVideoIds.push(videoId);
    }
  });

  if (currentFolderVideoIds.length > 0) {
    bookmarks.unshift({ folderName: parentFolder, videoIds: currentFolderVideoIds });
  }
  return bookmarks;
}

/***********************************
 *            Tabs
 ***********************************/

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function getCurrentTabBody(): Promise<string> {
    const tab = await getActiveTab();
    if (!tab.id) return "";
    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerHTML
    });
    return results[0].result || "";
}

function closeTabs(tabs: chrome.tabs.Tab[]) {
  const ids = tabs.map((tab) => tab.id).filter(id => id !== undefined) as number[];
  chrome.tabs.remove(ids);
}

async function getCurrentYoutubeTabs(includePlaylistTabs: boolean) {
  let tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs.filter(tab => {
      const url = tab.url || "";
      const isYoutube = url.includes("youtube.com/watch");
      const isPlaylist = url.includes("list=");
      if (includePlaylistTabs) return isYoutube;
      return isYoutube && !isPlaylist;
  });
}

/***********************************
 *            Parsing
 ***********************************/

function parseYoutubeThumbnailIds(text: string) {
  const regex = /(?:img\.youtube|i\.ytimg|i1\.ytimg)\.com\/vi\/([^\/\s]+)/ig;
  const videoIds = [];
  let match;
  while ((match = regex.exec(text))) videoIds.push(match[1]);
  return videoIds;
}

function parseYoutubeLinks(text: string) {
  const regex = /(?:v=|shorts\/|live\/)([a-zA-Z0-9_-]{11})/ig;
  const videoIds = [];
  let match;
  while ((match = regex.exec(text))) videoIds.push(match[1]);
  return videoIds;
}

/***********************************
 *            Playlists
 ***********************************/

async function createPlaylist(videoIds: string[], title?: string) {
  await chrome.runtime.sendMessage({ cmd: "create-playlist", videoIds, title });
}

function notify(message: string, isInfo = false) {
  chrome.notifications.create({
    type: "basic",
    title: "YouTube Playlist Helper" + (isInfo ? "" : ": Error"),
    message: message,
    iconUrl: "../icons/icon_48.png",
  });
}
