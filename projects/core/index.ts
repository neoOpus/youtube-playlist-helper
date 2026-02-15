export * from "./services/storage-service";
export * from "./services/video-service";
export * from "./services/playlist-service";
export * from "./services/metadata-service";
export * from "./services/action-logger";
export * from "./services/ai-service";
export * from "./services/alternatives-service";
export * from "./services/backup-service";
export * from "./services/playlists-sorter";
export * from "./services/utils";
export * from "./services/webdav-service";
export * from "./types/model";

/**
 * Initializes all core services.
 */
export async function initCore() {
    console.log("Core: Initializing services...");
    // Services that self-initialize on import will run when this file is imported.
    // This function provides an explicit hook if needed.
}
