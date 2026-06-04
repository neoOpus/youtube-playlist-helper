import { storageService, videoService } from '@yph/core';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-to-builder",
    title: "Add to YPH Builder",
    contexts: ["link", "video"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "add-to-builder") {
    const videoId = info.linkUrl ? videoService.parseYoutubeId(info.linkUrl) : null;
    if (videoId) {
        const builder = await storageService.fetchObject("playlist_builder", []);
        builder.push(videoId);
        await storageService.storeObject("playlist_builder", builder);
    }
  }
});
