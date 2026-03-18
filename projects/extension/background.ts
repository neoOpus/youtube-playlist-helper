import { storageService } from '@yph/core';
import { videoService } from '@yph/core';

// This is a placeholder for the modern Manifest V3 background script
// It will eventually replace the legacy background.js and integrate with core services

console.log('Modern background script initialized with core services.');

// Initial logic for context menus (to be expanded)
storageService.getSettings().then(settings => {
  console.log('Settings loaded in background:', settings);
});

// Communication with dashboard
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'ping') {
    sendResponse({ status: 'ok', version: '3.0.0-alpha' });
  }
});
