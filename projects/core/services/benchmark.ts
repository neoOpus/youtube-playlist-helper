import { PlaylistService } from './playlist-service';
import { PlaylistsSorter } from './playlists-sorter';
import { Playlist, Video } from '../types/model';

export async function runBenchmark(itemCount: number = 1000) {
    console.log(`--- Starting SOTA Benchmark: ${itemCount} items ---`);

    // Generate mock data
    const mockVideos: Video[] = Array.from({ length: itemCount }, (_, i) => ({
        id: `video-${i}`,
        title: `SOTA Performance Test Video ${i} ${Math.random().toString(36).substring(7)}`,
        channel: `Channel ${i % 50}`,
        thumbnail: 'https://via.placeholder.com/150',
        addedAt: Date.now() - Math.random() * 10000000
    }));

    const sorter = new PlaylistsSorter();

    // Test 1: Natural Title Sort
    const startSort = performance.now();
    const sorted = sorter.sort(mockVideos, 'title', 'asc');
    const endSort = performance.now();
    console.log(`Natural Title Sort (${itemCount} items): ${(endSort - startSort).toFixed(2)}ms`);

    // Test 2: Filter Performance (Mocking fuzzy search)
    const startFilter = performance.now();
    const filtered = mockVideos.filter(v => v.title.toLowerCase().includes('sota') && v.channel.includes('1'));
    const endFilter = performance.now();
    console.log(`Complex Filter (${itemCount} items): ${(endFilter - startFilter).toFixed(2)}ms`);

    return {
        sortTime: endSort - startSort,
        filterTime: endFilter - startFilter
    };
}
