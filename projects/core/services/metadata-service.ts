import type { Video } from "../types/model";
import { storageService } from "./storage-service";

/**
 * Prefix for video metadata keys in storage.
 */
const METADATA_KEY_PREFIX = "metadata_";

/**
 * Service for managing per-video metadata independent of playlists.
 */
export const metadataService = {
  /**
   * Retrieves metadata for a specific video.
   * @param videoId The YouTube video ID.
   * @returns A partial Video object containing metadata.
   */
  async getVideoMetadata(videoId: string): Promise<Partial<Video>> {
    const data = await storageService.fetchObject(METADATA_KEY_PREFIX + videoId, null);
    if (!data) return {};
    return typeof data === 'string' ? JSON.parse(data) : data;
  },

  /**
   * Saves metadata for a specific video.
   * @param videoId The YouTube video ID.
   * @param metadata The metadata to save.
   */
  async saveVideoMetadata(videoId: string, metadata: Partial<Video>) {
    // Merge with existing metadata to avoid overwriting fields not provided in this call
    const existing = await this.getVideoMetadata(videoId);
    const merged = { ...existing, ...metadata };
    await storageService.storeObject(METADATA_KEY_PREFIX + videoId, merged);
  }
};
