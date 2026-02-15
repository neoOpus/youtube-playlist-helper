import os
import re

file_moves = {
    "storage-service": "core/storage-service",
    "video-service": "core/video-service",
    "playlist-service": "core/playlist-service",
    "playlists-sorter": "core/playlists-sorter",
    "utils": "core/utils",
    "supabase-service": "mega/supabase-service",
    "sync-service": "mega/sync-service",
    "ai-service": "mega/ai-service",
    "alternatives-service": "mega/alternatives-service",
    "action-logger": "mega/action-logger",
    "backup-service": "mega/backup-service",
    "metadata-service": "mega/metadata-service",
    "SmartElement.svelte": "ui/SmartElement.svelte",
    "SuperButton.svelte": "ui/SuperButton.svelte",
    "SuperCheckbox.svelte": "ui/SuperCheckbox.svelte",
    "FloatingButton.svelte": "ui/FloatingButton.svelte",
    "LargeButton.svelte": "ui/LargeButton.svelte",
    "SimpleButton.svelte": "ui/SimpleButton.svelte",
    "Modal.svelte": "ui/Modal.svelte",
    "LoadingModal.svelte": "ui/LoadingModal.svelte",
    "AdvancedPlaylistView.svelte": "mega/AdvancedPlaylistView.svelte",
    "BulkActionBar.svelte": "mega/BulkActionBar.svelte",
    "PlaylistComparison.svelte": "mega/PlaylistComparison.svelte",
    "PlaylistTimeline.svelte": "mega/PlaylistTimeline.svelte",
    "VideoIdCard.svelte": "mega/VideoIdCard.svelte",
    "UndoNotification.svelte": "mega/UndoNotification.svelte",
    "GlobalHeader.svelte": "mega/GlobalHeader.svelte",
    "StatusBar.svelte": "mega/StatusBar.svelte",
    "PlaylistPreview.svelte": "core/PlaylistPreview.svelte",
    "PlaylistSelector.svelte": "core/PlaylistSelector.svelte",
    "PlaylistVideo.svelte": "core/PlaylistVideo.svelte",
    "PaginationNav.svelte": "core/PaginationNav.svelte",
    "Sidebar.svelte": "core/Sidebar.svelte",
    "PlaylistsFilters.svelte": "core/PlaylistsFilters.svelte",
    "PlaylistCount.svelte": "core/PlaylistCount.svelte",
    "PlaylistEditor.svelte": "core/PlaylistEditor.svelte",
}

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Determine current folder depth relative to src
    rel_path = os.path.relpath(filepath, 'playlist-editor/src')
    depth = len(rel_path.split(os.sep)) - 1

    def get_new_path(match):
        original_import = match.group(1)
        # Handle cases like "./X" or "../X"
        parts = original_import.split('/')
        filename = parts[-1]
        if filename.endswith('.js'): filename = filename[:-3]

        # Check if filename is in our moves
        for key, value in file_moves.items():
            if filename == key or (filename + '.svelte' == key):
                # Calculate relative path
                # This is simplified: we know they moved to core/ mega/ ui/
                # If they were in src/components, they are now in src/components/core etc.
                # If the import was in src/components/core and it wants ui/, it needs ../ui/

                # We can just use absolute-like paths if we know the root, but Svelte prefers relative.
                # For now, let's fix based on known locations.

                if filepath.endswith('.svelte'):
                    # Heuristic for component imports
                    if 'components' in filepath:
                        if 'core' in filepath:
                            if 'ui/' in value: return 'import ' + match.group(0).split('import ')[1].replace(original_import, '../ui/' + filename)
                            if 'mega/' in value: return 'import ' + match.group(0).split('import ')[1].replace(original_import, '../mega/' + filename)
                        # ... and so on.

                # Let's try a simpler approach: just replace common broken patterns
                pass
        return match.group(0)

    # I'll manually fix the major ones instead of a complex script
    return content

# Actually, let's just use sed for the most common ones and then fix manually.
