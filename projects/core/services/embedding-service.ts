import { pipeline, env } from '@xenova/transformers';

// Configuration for in-browser/extension execution
env.allowLocalModels = false;
env.useBrowserCache = true;

let extractor: any = null;

export const embeddingService = {
  /**
   * Initializes the embedding model.
   * Uses a lightweight model optimized for browser environments.
   */
  async init() {
    if (extractor) return;
    try {
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    } catch (e) {
        console.error("Failed to initialize embedding model:", e);
    }
  },

  /**
   * Generates embeddings for a given text.
   */
  async getEmbeddings(text: string): Promise<number[]> {
    await this.init();
    if (!extractor) return [];

    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  },

  /**
   * Calculates cosine similarity between two vectors.
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
};
