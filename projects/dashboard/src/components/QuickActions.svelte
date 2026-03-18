<script lang="ts">
  import { browserService } from '@yph/core';
  import { videoService, storageService, notificationService } from '@yph/core';
  import MergeIcon from '@yph/ui-kit/components/icons/MergeIcon.svelte';
  import SearchIcon from '@yph/ui-kit/components/icons/SearchIcon.svelte';
  import PlaylistPlusIcon from '@yph/ui-kit/components/icons/PlaylistPlusIcon.svelte';
  import TerminalIcon from '@yph/ui-kit/components/icons/TerminalIcon.svelte';

  async function combineAllTabs() {
    try {
      const tabs = await browserService.getYoutubeTabs();
      const videoIds = new Set<string>();

      for (const tab of tabs) {
          if (tab.url?.includes("list=")) {
              const tabVideoIds = await browserService.executeScript(tab.id!, "/scripts/getPlaylistVideoIds.js");
              if (tabVideoIds) tabVideoIds.forEach((id: string) => videoIds.add(id));
          } else {
              const videoId = videoService.parseYoutubeId(tab.url || "");
              if (videoId) videoIds.add(videoId);
          }
      }

      if (videoIds.size > 0) {
          const playlist = await videoService.generatePlaylist(Array.from(videoIds), "Combined Workspace");
          await storageService.savePlaylist(playlist);
          notificationService.success(`Combined ${videoIds.size} videos into a new playlist.`);

          const settings = await storageService.getSettings();
          if (settings.closeAfterCombine) {
              await browserService.closeTabs(tabs.map(t => t.id!).filter(id => id !== undefined));
          }
      } else {
          notificationService.info("No YouTube videos found in open tabs.");
      }
    } catch (e: any) {
      notificationService.error("Failed to combine tabs: " + e.message);
    }
  }

  async function scanCurrentPage() {
    try {
      const videoIds = await browserService.scanCurrentTabForVideos();
      if (videoIds.length > 0) {
          const playlist = await videoService.generatePlaylist(videoIds, "Scanned Collection");
          await storageService.savePlaylist(playlist);
          notificationService.success(`Extracted ${videoIds.length} videos from page.`);
      } else {
          notificationService.info("No YouTube links detected on the current page.");
      }
    } catch (e: any) {
      notificationService.error("Scan failed: " + e.message);
    }
  }

  async function convertToQueue() {
    try {
      const tab = await browserService.getActiveTab();
      if (tab?.id && tab.url?.includes("list=")) {
          await browserService.executeScript(tab.id, "/scripts/convert-playlist-to-queue.js");
          notificationService.success("Playlist converted to queue.");
      } else {
          notificationService.error("Active tab is not a playing YouTube playlist.");
      }
    } catch (e: any) {
      notificationService.error("Conversion failed: " + e.message);
    }
  }
</script>

<div class="quick-actions-grid mt-4">
    <button class="action-card sota-glass" onclick={combineAllTabs}>
        <div class="icon-wrap"><MergeIcon size="24" /></div>
        <div class="action-info">
            <span class="label">Combine Workspace</span>
            <span class="desc">Merge all YouTube tabs into one playlist</span>
        </div>
    </button>

    <button class="action-card sota-glass" onclick={scanCurrentPage}>
        <div class="icon-wrap"><SearchIcon size="24" /></div>
        <div class="action-info">
            <span class="label">Scan Current Page</span>
            <span class="desc">Extract all YouTube links from the active tab</span>
        </div>
    </button>

    <button class="action-card sota-glass" onclick={convertToQueue}>
        <div class="icon-wrap"><TerminalIcon size="24" /></div>
        <div class="action-info">
            <span class="label">Convert to Queue</span>
            <span class="desc">Turn current playlist into a YouTube queue</span>
        </div>
    </button>
</div>

<style>
    .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .action-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 12px;
        text-align: left;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(255, 255, 255, 0.05);
        background: rgba(255, 255, 255, 0.02);
    }

    .action-card:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border-color: var(--sota-primary-dim);
    }

    .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: linear-gradient(135deg, var(--sota-primary), var(--sota-primary-dim));
        color: white;
        flex-shrink: 0;
    }

    .action-info {
        display: flex;
        flex-direction: column;
    }

    .label {
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--text-primary);
    }

    .desc {
        font-size: 0.75rem;
        color: var(--text-secondary);
        opacity: 0.8;
    }
</style>
