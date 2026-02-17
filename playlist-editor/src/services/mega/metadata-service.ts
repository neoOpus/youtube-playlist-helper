import { storage } from '../core/storage-service';
import type { Video } from "../../types/model.js";

const METADATA_KEY_PREFIX = "metadata_";

export const metadataService = {
  async getVideoMetadata(videoId: string): Promise<Partial<Video>> {
    const data = await storage.get(METADATA_KEY_PREFIX + videoId, null);
    return data ? JSON.parse(data) : {};
  },

  async saveVideoMetadata(videoId: string, metadata: Partial<Video>) {
    await storage.set(METADATA_KEY_PREFIX + videoId, JSON.stringify(metadata));
  }
};
