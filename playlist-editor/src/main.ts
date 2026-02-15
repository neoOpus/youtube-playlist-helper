import App from "./App.svelte";
import { initTheme } from "./stores/theme.store.js";

async function loadServices() {
  if (!window.savePlaylist) {
    await import("./services/core/storage-service");
    await import("./services/core/video-service");
    await import("./services/core/utils");
  }
}

let app;

async function init() {
  if (app) return;
  await loadServices();
  app = new App({
    target: document.body,
  });
  initTheme();
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

export default app;
