import { describe, it, expect } from 'vitest';
import { playlistsSorter } from './playlists-sorter.js';
import type { Playlist } from '../types/model.js';

describe('playlistsSorter', () => {
    const p1: Playlist = { id: '1', title: 'Beta Playlist', videos: [], timestamp: 1000 };
    const p2: Playlist = { id: '2', title: 'Alpha Playlist', videos: [], timestamp: 2000 };
    const p3: Playlist = { id: '3', title: '10 Pro Tips', videos: [], timestamp: 1500 };
    const p4: Playlist = { id: '4', title: '2 Pro Tips', videos: [], timestamp: 1200 };

    const playlists = [p1, p2, p3, p4];

    it('should sort by title A-Z (natural sort)', async () => {
        const sorted = await playlistsSorter.sort([...playlists], 'title-az');
        expect(sorted[0].title).toBe('2 Pro Tips');
        expect(sorted[1].title).toBe('10 Pro Tips');
        expect(sorted[2].title).toBe('Alpha Playlist');
    });

    it('should sort by newest first', async () => {
        const sorted = await playlistsSorter.sort([...playlists], 'date-created-desc');
        expect(sorted[0].timestamp).toBe(2000);
        expect(sorted[3].timestamp).toBe(1000);
    });

    it('should handle empty titles gracefully', async () => {
        const px = { ...p1, title: '' };
        await expect(playlistsSorter.sort([px, p1], 'title-az')).resolves.not.toThrow();
    });
});
