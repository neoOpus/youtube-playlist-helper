import { describe, it, expect } from 'vitest';
import { getPlaylistsSorter } from './playlists-sorter.js';
import type { Playlist } from '../types/model.js';

describe('playlistsSorter', () => {
    const p1: Playlist = { id: '1', title: 'Beta Playlist', videos: [], timestamp: 1000 };
    const p2: Playlist = { id: '2', title: 'Alpha Playlist', videos: [], timestamp: 2000 };
    const p3: Playlist = { id: '3', title: '10 Quantum Tips', videos: [], timestamp: 1500 };
    const p4: Playlist = { id: '4', title: '2 Quantum Tips', videos: [], timestamp: 1200 };

    const playlists = [p1, p2, p3, p4];

    it('should sort by title A-Z (natural sort)', () => {
        const sorter = getPlaylistsSorter('title-az');
        const sorted = [...playlists].sort(sorter);
        expect(sorted[0].title).toBe('2 Quantum Tips');
        expect(sorted[1].title).toBe('10 Quantum Tips');
        expect(sorted[2].title).toBe('Alpha Playlist');
    });

    it('should sort by newest first', () => {
        const sorter = getPlaylistsSorter('date-created-desc');
        const sorted = [...playlists].sort(sorter);
        expect(sorted[0].timestamp).toBe(2000);
        expect(sorted[3].timestamp).toBe(1000);
    });

    it('should handle empty titles gracefully', () => {
        const px = { ...p1, title: '' };
        const sorter = getPlaylistsSorter('title-az');
        expect(() => [px, p1].sort(sorter)).not.toThrow();
    });
});
