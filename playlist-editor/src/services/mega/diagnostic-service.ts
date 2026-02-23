import { storage } from '../core/storage-service';
import { supabaseService } from './supabase-service';

export interface DiagnosticResult {
    id: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    suggestion: string;
    actionLabel: string;
    action: () => Promise<void>;
}

class DiagnosticService {
    async runDiagnostics(): Promise<DiagnosticResult[]> {
        const issues: DiagnosticResult[] = [];

        // Check Storage Usage
        const all = await storage.getAll();
        const usage = JSON.stringify(all).length * 2;
        if (usage > 4.5 * 1024 * 1024) {
            issues.push({
                id: 'storage-full',
                level: 'error',
                message: 'Browser storage is nearly full.',
                suggestion: 'Compress old playlists or export and clear them.',
                actionLabel: 'Perform Cleanup',
                action: async () => { }
            });
        }

        // Check Sync Connectivity
        try {
            const res: any = await supabaseService.healthCheck();
            if (res.error) throw new Error(res.error);
        } catch (e) {
            issues.push({
                id: 'sync-offline',
                level: 'warning',
                message: 'Cloud sync is currently unreachable.',
                suggestion: 'Check your internet connection or re-authenticate.',
                actionLabel: 'Re-authenticate',
                action: async () => { await supabaseService.signInWithGoogle(); }
            });
        }

        const playlists = await storage.getPlaylists();
        const ids = playlists.map(p => p.id);
        if (new Set(ids).size !== ids.length) {
            issues.push({
                id: 'logical-corruption',
                level: 'error',
                message: 'Logical data corruption detected (Duplicate IDs).',
                suggestion: 'Run the auto-repair tool to re-index your library.',
                actionLabel: 'Repair Now',
                action: async () => { }
            });
        }

        return issues;
    }
}

export const diagnosticService = new DiagnosticService();
