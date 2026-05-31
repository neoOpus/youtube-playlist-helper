# YouTube Playlist Helper Extension

This directory contains the Chrome extension manifest and assets.

## Build Requirements

The extension depends on built artifacts from the dashboard. The background script and editor files are compiled and placed into `editor/build/`.

To build the extension, run the following command from the repository root:

```bash
npm run build
```

Or build the dashboard specifically:

```bash
npm run build --workspace=@yph/dashboard
```

## Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select this directory (`projects/extension`).

**Note:** Ensure the build step has been completed, otherwise Chrome will fail to load the background script.
