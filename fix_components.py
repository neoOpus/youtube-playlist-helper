import os
import re

def fix_imports(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Heuristic for component imports in components/ folder
    # Example: from "./X.svelte"

    # If in core/, and importing from icons/, it's now ../icons/
    if 'components/core' in filepath:
        content = re.sub(r'from "./icons/', r'from "../icons/', content)
        # If importing from ui/
        for ui_comp in ["FloatingButton", "LoadingModal", "Modal", "SimpleButton", "SuperCheckbox", "SuperButton", "LargeButton"]:
            content = re.sub(f'from "./{ui_comp}.svelte"', f'from "../ui/{ui_comp}.svelte"', content)
        # If importing from mega/
        for mega_comp in ["BulkActionBar", "PlaylistTimeline", "VideoIdCard", "AdvancedPlaylistView", "PlaylistComparison", "UndoNotification", "GlobalHeader", "StatusBar"]:
            content = re.sub(f'from "./{mega_comp}.svelte"', f'from "../mega/{mega_comp}.svelte"', content)

    elif 'components/mega' in filepath:
        content = re.sub(r'from "./icons/', r'from "../icons/', content)
        # If importing from ui/
        for ui_comp in ["FloatingButton", "LoadingModal", "Modal", "SimpleButton", "SuperCheckbox", "SuperButton", "LargeButton"]:
            content = re.sub(f'from "./{ui_comp}.svelte"', f'from "../ui/{ui_comp}.svelte"', content)
        # If importing from core/
        for core_comp in ["PlaylistVideo", "Sidebar", "PaginationNav", "PlaylistPreview", "PlaylistSelector", "PlaylistsFilters", "PlaylistCount", "PlaylistEditor"]:
            content = re.sub(f'from "./{core_comp}.svelte"', f'from "../core/{core_comp}.svelte"', content)

    # Fix service imports
    content = re.sub(r'from "../services/', r'from "../../services/', content)
    # Then refine services to core/ or mega/
    # This part is harder without knowing which service is where.
    core_services = ["playlist-service", "video-service", "storage-service", "playlists-sorter", "utils"]
    mega_services = ["sync-service", "backup-service", "supabase-service", "ai-service", "alternatives-service", "action-logger", "metadata-service"]

    for s in core_services:
        content = content.replace(f'from "../../services/{s}', f'from "../../services/core/{s}')
    for s in mega_services:
        content = content.replace(f'from "../../services/{s}', f'from "../../services/mega/{s}')

    with open(filepath, 'w') as f:
        f.write(content)

for root, dirs, files in os.walk('playlist-editor/src/components'):
    for file in files:
        if file.endswith('.svelte'):
            fix_imports(os.path.join(root, file))
