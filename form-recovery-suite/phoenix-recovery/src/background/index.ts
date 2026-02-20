console.log('Phoenix Background Service Worker Initialized');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Phoenix Form Recovery Installed');
});
