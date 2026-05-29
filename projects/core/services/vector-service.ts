import { storageService } from "./storage-service.js";

const VECTOR_STORE_KEY = "neural_vector_index";

export const vectorService = {
  /**
   * Dedicated vector storage for high-performance similarity scans.
   */
  async getVectorIndex(): Promise<Record<string, number[]>> {
      return await storageService.fetchObject(VECTOR_STORE_KEY, {});
  },

  async saveVector(nodeId: string, embeddings: number[]) {
      const index = await this.getVectorIndex();
      index[nodeId] = embeddings;
      await storageService.storeObject(VECTOR_STORE_KEY, index);
  },

  async clearIndex() {
      await storageService.removeObject(VECTOR_STORE_KEY);
  }
};
