import { storage } from '../core/storage-service';

class PersistenceService {
    private db: IDBDatabase | null = null;
    private readonly DB_NAME = "YPH_Mega_Cache";
    private readonly STORE_NAME = "video_metadata";

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, 1);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: "videoId" });
                }
            };
            request.onsuccess = () => {
                this.db = request.result;
                resolve(true);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async cacheVideo(video: any) {
        if (!this.db) return;
        const tx = this.db.transaction(this.STORE_NAME, "readwrite");
        tx.objectStore(this.STORE_NAME).put(video);
    }

    async getCachedVideo(videoId: string) {
        if (!this.db) return null;
        return new Promise((resolve) => {
            const tx = this.db.transaction(this.STORE_NAME, "readonly");
            const request = tx.objectStore(this.STORE_NAME).get(videoId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        });
    }

    async getAllCached() {
        if (!this.db) return [];
        return new Promise((resolve) => {
            const tx = this.db.transaction(this.STORE_NAME, "readonly");
            const request = tx.objectStore(this.STORE_NAME).getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve([]);
        });
    }
}

export const persistenceService = new PersistenceService();
