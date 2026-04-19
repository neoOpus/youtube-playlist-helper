import { describe, it, expect } from 'vitest';
import { formatExporter } from './format-exporter.js';
import type { Playlist, Video } from '../types/model.js';

describe('formatExporter - Data Serialization', () => {
    const mockVideos: Video[] = [
        {
            id: 'v1',
            videoId: 'vid1',
            title: 'Video, with Comma',
            url: 'https://youtu.be/1',
            channel: 'Author "One"',
            thumbnailUrl: '',
            duration: '10:00',
            views: '1M',
            dateAdded: 1704067200000 // 2024-01-01
        }
    ];

    const playlists: Playlist[] = [
        {
            id: 'p1',
            title: 'Test Playlist',
            videos: ['v1'],
            loadedVideos: mockVideos,
            timestamp: Date.now()
        }
    ];

    it('should correctly escape and format CSV', () => {
        const csv = formatExporter.toCSV(playlists);
        expect(csv).toContain('"Video, with Comma"');
        expect(csv).toContain('Author ""One""');
        expect(csv).toContain('https://youtu.be/1');
    });

    it('should format Markdown tables', () => {
        const md = formatExporter.toMarkdown(playlists);
        expect(md).toContain('## Test Playlist');
        // Match the high-fidelity format: | [Title](URL) | Author | metrics | assessment |
        expect(md).toContain('| [Video, with Comma](https://youtu.be/1) | Author "One" |');
        expect(md).toContain('⏱️ 10:00 • 👁️ 1M');
    });

    it('should format Plain Text summaries', () => {
        const txt = formatExporter.toTXT(playlists);
        expect(txt).toContain('Playlist: Test Playlist');
        expect(txt).toContain('- Video, with Comma (https://youtu.be/1)');
    });
});
