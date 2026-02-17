import { storage } from './services/core/storage-service';
import App from "./App.svelte";
import { initTheme } from "./stores/theme.store.js";
import { i18nService } from "./services/core/i18n-service";
import { shortcutService } from "./services/mega/shortcut-service";

async function loadServices() {
  // Services are now imported via ESM
}

let app: App;

async function init() {
  if (app) return;
  await loadServices();

  await i18nService.init();
  shortcutService.init();

  // Default global shortcuts
  shortcutService.register({
      id: 'open-omni',
      key: 'ctrl+g',
      description: 'Open Omni View',
      action: () => { window.location.hash = '#/omni'; }
  });

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
