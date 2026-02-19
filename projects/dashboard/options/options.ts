import { storageService } from "@yph/core";

const getById = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLSelectElement;

async function saveOptions() {
  const settings = {
    openPlaylistEditorAfterCreation: (getById("openPlaylistEditorAfterCreation") as HTMLInputElement).checked,
    openPlaylistPage: (getById("openPlaylistPage") as HTMLInputElement).checked,
    closeAfterCombine: (getById("closeAfterCombine") as HTMLInputElement).checked,
    disableThumbnails: (getById("disableThumbnails") as HTMLInputElement).checked,
    openPlaylistBuilderAfterAdd: (getById("openPlaylistBuilderAfterAdd") as HTMLInputElement).checked,
    openSavedPlaylistAfterAdd: (getById("openSavedPlaylistAfterAdd") as HTMLInputElement).checked,
    saveCreatedPlaylists: (getById("saveCreatedPlaylists") as HTMLInputElement).checked,
    disableContextBuilder: (getById("disableContextBuilder") as HTMLInputElement).checked,
    disableContextSaved: (getById("disableContextSaved") as HTMLInputElement).checked,
    defaultEditorPage: getById("defaultEditorPage").value,
    themeChoice: getById("themeChoice").value,
    viewMode: getById("viewMode").value,
  };

  for (const [key, value] of Object.entries(settings)) {
    await storageService.storeObject(key, value);
  }

  await chrome.runtime.sendMessage({ cmd: "update-settings" });

  const status = document.getElementById("status")!;
  status.textContent = "Options saved.";
  setTimeout(() => status.textContent = "", 750);
}

async function restoreOptions() {
  const settings = await storageService.getSettings();

  (getById("openPlaylistEditorAfterCreation") as HTMLInputElement).checked = settings.openPlaylistEditorAfterCreation;
  (getById("openPlaylistPage") as HTMLInputElement).checked = settings.openPlaylistPage;
  (getById("closeAfterCombine") as HTMLInputElement).checked = settings.closeAfterCombine;
  (getById("disableThumbnails") as HTMLInputElement).checked = settings.disableThumbnails;
  (getById("openPlaylistBuilderAfterAdd") as HTMLInputElement).checked = settings.openPlaylistBuilderAfterAdd;
  (getById("openSavedPlaylistAfterAdd") as HTMLInputElement).checked = settings.openSavedPlaylistAfterAdd;
  (getById("saveCreatedPlaylists") as HTMLInputElement).checked = settings.saveCreatedPlaylists;
  (getById("disableContextBuilder") as HTMLInputElement).checked = settings.disableContextBuilder;
  (getById("disableContextSaved") as HTMLInputElement).checked = settings.disableContextSaved;
  getById("defaultEditorPage").value = settings.defaultEditorPage;
  getById("themeChoice").value = settings.themeChoice;
  getById("viewMode").value = settings.viewMode;
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save")!.addEventListener("click", saveOptions);
