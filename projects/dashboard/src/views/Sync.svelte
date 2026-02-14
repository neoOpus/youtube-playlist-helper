<script lang="ts">
  import { onMount } from "svelte";
  import { storageService, webdavService, notificationService } from "@yph/core";

  let url = "";
  let username = "";
  let password = "";
  let testing = false;

  onMount(async () => {
    const config = await storageService.fetchObject("webdav_config", {});
    url = config.url || "";
    username = config.username || "";
    password = config.password || "";
  });

  async function save() {
    await storageService.storeObject("webdav_config", { url, username, password });
    notificationService.success("WebDAV configuration saved.");
  }

  async function test() {
    testing = true;
    const ok = await webdavService.testConnection(url, username, password);
    testing = false;
    if (ok) {
        notificationService.success("Connection successful!");
    } else {
        notificationService.error("Connection failed. Check your settings.");
    }
  }
</script>

<main>
  <h1>Cloud Sync Settings (WebDAV)</h1>
  <div class="form">
    <label>
      Server URL
      <input type="text" bind:value={url} placeholder="https://example.com/webdav/" />
    </label>
    <label>
      Username
      <input type="text" bind:value={username} />
    </label>
    <label>
      Password
      <input type="password" bind:value={password} />
    </label>

    <div class="btns">
        <button on:click={save}>Save Settings</button>
        <button on:click={test} disabled={testing}>{testing ? 'Testing...' : 'Test Connection'}</button>
    </div>
  </div>
</main>

<style>
  .form {
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  label {
      display: flex;
      flex-direction: column;
      gap: 5px;
  }
  .btns {
      display: flex;
      gap: 10px;
  }
</style>
