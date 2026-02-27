#!/bin/bash
set -e

echo "--- Building Phoenix SOTA Userscript ---"
cd form-recovery-suite/phoenix-userscript
npm run build

echo "--- Building Phoenix Extension (MV3) ---"
cd ../phoenix-recovery
npm run build

echo "--- Building YouTube Playlist Helper ---"
cd ../../youtube-playlist-helper/playlist-editor
npm run build

echo "--- All Projects Built Successfully ---"
