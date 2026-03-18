import { describe, it, expect, beforeEach, vi } from 'vitest';
import { historyService, type VideoHistoryEntry } from './history-service.js';
import { storageService } from './storage-service.js';

vi.mock('./storage-service.js', () => ({
    storageService: {
        fetchObject: vi.fn(),
        storeObject: vi.fn()
    }
}));

describe('historyService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should log history when metadata changes', async () => {
        vi.mocked(storageService.fetchObject).mockResolvedValue([]);

        await historyService.logHistory('v1', 'New Title', 'New Channel');

        expect(storageService.storeObject).toHaveBeenCalledWith(
            'v_history_v1',
            expect.arrayContaining([
                expect.objectContaining({ title: 'New Title', channel: 'New Channel' })
            ])
        );
    });

    it('should not log duplicate history entries', async () => {
        const existing: VideoHistoryEntry[] = [{ videoId: 'v1', title: 'T1', channel: 'C1', timestamp: Date.now() }];
        vi.mocked(storageService.fetchObject).mockResolvedValue(existing);

        await historyService.logHistory('v1', 'T1', 'C1');

        expect(storageService.storeObject).not.toHaveBeenCalled();
    });
});
