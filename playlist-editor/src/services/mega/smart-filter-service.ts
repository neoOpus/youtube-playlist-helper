import type { Video } from '../../types/model';

export interface FilterCriteria {
    text?: string;
    watched?: boolean;
    channel?: string;
    afterDate?: number;
    beforeDate?: number;
}

class SmartFilterService {
    parseQuery(query: string): FilterCriteria {
        const criteria: FilterCriteria = {};
        const q = query.toLowerCase();

        // 1. Watched status
        if (q.includes('is:watched') || q.includes('watched:true')) criteria.watched = true;
        else if (q.includes('is:unwatched') || q.includes('watched:false')) criteria.watched = false;

        // 2. Dates (Heuristic)
        if (q.includes('from:2025')) criteria.afterDate = new Date('2025-01-01').getTime();
        if (q.includes('from:2024')) criteria.afterDate = new Date('2024-01-01').getTime();
        if (q.includes('from:2023')) criteria.afterDate = new Date('2023-01-01').getTime();

        // 3. Channel
        const channelMatch = q.match(/channel:([^\s]+)/);
        if (channelMatch) criteria.channel = channelMatch[1];

        // 4. Remaining text is search term
        criteria.text = q.replace(/is:\w+/g, '')
                        .replace(/watched:\w+/g, '')
                        .replace(/from:\d+/g, '')
                        .replace(/channel:[^\s]+/g, '')
                        .trim();

        return criteria;
    }

    applyFilter(videos: Video[], query: string): Video[] {
        if (!query) return videos;
        const c = this.parseQuery(query);

        return videos.filter(v => {
            if (c.watched !== undefined && v.watched !== c.watched) return false;
            if (c.channel && !v.channel.toLowerCase().includes(c.channel)) return false;
            if (c.text && !v.title.toLowerCase().includes(c.text) && !v.channel.toLowerCase().includes(c.text)) return false;
            // metadata-service handles dateAdded, if we have it in video object
            if (c.afterDate && (v as any).dateAdded && (v as any).dateAdded < c.afterDate) return false;
            return true;
        });
    }
}

export const smartFilterService = new SmartFilterService();
