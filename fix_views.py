import os
import re

def fix_imports(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Views are in src/views/
    # They import from ../components/
    # Need to update to ../components/core/ or ui/ or mega/

    comp_map = {
        "Sidebar": "core/Sidebar",
        "PlaylistSelector": "core/PlaylistSelector",
        "PlaylistPreview": "core/PlaylistPreview",
        "PlaylistsFilters": "core/PlaylistsFilters",
        "PlaylistCount": "core/PlaylistCount",
        "SuperButton": "ui/SuperButton",
        "SuperCheckbox": "ui/SuperCheckbox",
        "Modal": "ui/Modal",
        "LargeButton": "ui/LargeButton",
        "AdvancedPlaylistView": "mega/AdvancedPlaylistView",
    }

    for c, path in comp_map.items():
        content = content.replace(f'from "../components/{c}.svelte"', f'from "../components/{path}.svelte"')

    # Fix services
    core_services = ["playlist-service", "video-service", "storage-service", "playlists-sorter", "utils"]
    mega_services = ["sync-service", "backup-service", "supabase-service", "ai-service", "alternatives-service", "action-logger", "metadata-service"]

    for s in core_services:
        content = content.replace(f'from "../services/{s}', f'from "../services/core/{s}')
    for s in mega_services:
        content = content.replace(f'from "../services/{s}', f'from "../services/mega/{s}')

    with open(filepath, 'w') as f:
        f.write(content)

for root, dirs, files in os.walk('playlist-editor/src/views'):
    for file in files:
        if file.endswith('.svelte'):
            fix_imports(os.path.join(root, file))
