import { writable } from 'svelte/store';
import { storage } from '../core/storage-service';

export interface HealthReport {
    storageUsage: number;
    storageLimit: number;
    lastSyncStatus: 'success' | 'failure' | 'idle';
    lastSyncTime?: number;
    pendingOps: number;
    memoryUsage?: number;
    errors: string[];
}

class HealthService {
    private report = writable<HealthReport>({
        storageUsage: 0,
        storageLimit: 5242880, // Default local storage limit ~5MB
        lastSyncStatus: 'idle',
        pendingOps: 0,
        errors: []
    });

    reportStore = { subscribe: this.report.subscribe };

    async updateHealth() {
        const all = await storage.getAll();
        const usage = JSON.stringify(all).length * 2; // Rough estimate in bytes (UTF-16)
        const pending = await storage.get("storage_pending_ops", []);
        const lastSync = await storage.get("sync_config", {});

        this.report.update(r => ({
            ...r,
            storageUsage: usage,
            pendingOps: pending.length,
            lastSyncStatus: lastSync.lastSync ? 'success' : 'idle',
            lastSyncTime: lastSync.lastSync,
            memoryUsage: (performance as any).memory?.usedJSHeapSize
        }));
    }

    logError(msg: string) {
        this.report.update(r => ({
            ...r,
            errors: [msg, ...r.errors].slice(0, 10)
        }));
    }
}

export const healthService = new HealthService();
