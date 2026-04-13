import { describe, it } from 'vitest';
import { runBenchmark } from './benchmark';

describe('SOTA Performance Benchmarks', () => {
    it('should measure 1k items', async () => {
        await runBenchmark(1000);
    });
    it('should measure 5k items', async () => {
        await runBenchmark(5000);
    });
});
