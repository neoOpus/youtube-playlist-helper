import type { Video } from "../../types/model.js";

const METADATA_KEY_PREFIX = "metadata_";

export const metadataService = {
  async getVideoMetadata(videoId: string): Promise<Partial<Video>> {
    const data = await window.fetchObject(METADATA_KEY_PREFIX + videoId, null);
    return data ? JSON.parse(data) : {};
  },

  async saveVideoMetadata(videoId: string, metadata: Partial<Video>) {
    await window.storeObject(METADATA_KEY_PREFIX + videoId, JSON.stringify(metadata));
  }
};
