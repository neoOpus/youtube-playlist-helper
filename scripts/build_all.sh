#!/bin/bash
set -e

if [ -d "form-recovery-suite" ]; then
    echo "--- Building Phoenix Form Recovery Suite ---"
    cd form-recovery-suite/phoenix-userscript && npm run build
    cd ../phoenix-recovery && npm run build
    cd ../..
fi

if [ -d "youtube-playlist-helper" ]; then
    echo "--- Building YouTube Playlist Helper ---"
    cd youtube-playlist-helper/playlist-editor && npm run build
    cd ../..
fi

echo "--- All Available Projects Built Successfully ---"
