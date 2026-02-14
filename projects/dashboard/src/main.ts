import App from "./App.svelte";
import { initTheme } from "./stores/theme.store.js";

let app: App;

async function init() {
  if (app) return;
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
