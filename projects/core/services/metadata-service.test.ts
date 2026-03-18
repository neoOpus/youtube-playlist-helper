import { describe, it, expect, vi, beforeEach } from 'vitest';
import { metadataService } from './metadata-service.js';
import { storageService } from './storage-service.js';
import { historyService } from './history-service.js';

vi.mock('./storage-service.js', () => ({
    storageService: {
        fetchObject: vi.fn(),
        storeObject: vi.fn()
    }
}));

vi.mock('./history-service.js', () => ({
    historyService: {
        logHistory: vi.fn()
    }
}));

describe('metadataService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should merge metadata and log history on title change', async () => {
        vi.mocked(storageService.fetchObject).mockResolvedValue({ rating: 5 });

        await metadataService.saveVideoMetadata('v1', { title: 'Quantum Flux' });

        expect(storageService.storeObject).toHaveBeenCalledWith(
            'v_meta_v1',
            expect.objectContaining({ title: 'Quantum Flux', rating: 5 })
        );
        expect(historyService.logHistory).toHaveBeenCalled();
    });

    it('should perform bulk updates', async () => {
        await metadataService.bulkUpdateMetadata(['v1', 'v2'], { watched: true });
        expect(storageService.storeObject).toHaveBeenCalledTimes(2);
    });
});
