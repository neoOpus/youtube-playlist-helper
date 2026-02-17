<script lang="ts">
  import { storage } from '../../services/core/storage-service';
  import { onMount } from "svelte";

  let storageUsage = "0 KB";
  let statusText = "Ready";

  onMount(async () => {
    updateStorageUsage();
    // In a real app, we might listen for status changes
  });

  async function updateStorageUsage() {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.local.getBytesInUse) {
       const bytes = await browser.storage.local.getBytesInUse();
       storageUsage = (bytes / 1024).toFixed(1) + " KB";
    }
  }
</script>

<footer class="status-bar">
  <div class="left">
    <span class="dot active"></span>
    <span class="status-text">{statusText}</span>
  </div>

  <div class="right">
    <span class="usage">Local Storage: {storageUsage}</span>
    <span class="version">v2.0.0-mega</span>
  </div>
</footer>

<style>
  .status-bar {
    height: 28px;
    background: #1a1a1a;
    color: #888;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    font-size: 0.75rem;
    border-top: 1px solid #333;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #444;
  }

  .dot.active {
    background: #28a745;
    box-shadow: 0 0 5px #28a745;
  }

  .right {
    display: flex;
    gap: 1.5rem;
  }
</style>
