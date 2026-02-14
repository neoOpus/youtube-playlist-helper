import type { Video } from "../types/model.js";
import { storageService } from "./storage-service.js";

const METADATA_KEY_PREFIX = "metadata_";

export const metadataService = {
  async getVideoMetadata(videoId: string): Promise<Partial<Video>> {
    const data = await storageService.fetchObject(METADATA_KEY_PREFIX + videoId, null);
    return data ? (typeof data === 'string' ? JSON.parse(data) : data) : {};
  },

  async saveVideoMetadata(videoId: string, metadata: Partial<Video>) {
    await storageService.storeObject(METADATA_KEY_PREFIX + videoId, metadata);
  }
};
