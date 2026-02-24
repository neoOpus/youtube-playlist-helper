import type { Video } from '../../types/model';

class SemanticSearchService {
    // A mapping of concepts to related keywords (simulation of an embedding space)
    private conceptMap: Record<string, string[]> = {
        'programming': ['coding', 'javascript', 'python', 'software', 'developer', 'algorithm', 'git', 'web dev'],
        'hardware': ['cpu', 'gpu', 'laptop', 'build', 'unboxing', 'motherboard', 'tech review'],
        'gaming': ['nintendo', 'playstation', 'xbox', 'walkthrough', 'gameplay', 'pc gaming', 'speedrun'],
        'finance': ['stocks', 'crypto', 'investing', 'money', 'budget', 'portfolio', 'bitcoin'],
        'music': ['official video', 'live performance', 'concert', 'lyrics', 'album', 'remix']
    };

    search(videos: Video[], query: string): Video[] {
        const q = query.toLowerCase();
        const expandedTerms = this.expandQuery(q);

        return videos.map(video => {
            const score = this.calculateRelevance(video, expandedTerms);
            return { video, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.video);
    }

    private expandQuery(query: string): string[] {
        let terms = [query];
        for (const [concept, keywords] of Object.entries(this.conceptMap)) {
            if (query.includes(concept) || keywords.some(k => query.includes(k))) {
                terms.push(concept, ...keywords);
            }
        }
        return [...new Set(terms)];
    }

    private calculateRelevance(video: Video, terms: string[]): number {
        let score = 0;
        const text = (video.title + ' ' + video.channel + ' ' + (video.notes || '')).toLowerCase();

        for (const term of terms) {
            if (text.includes(term)) {
                // Exact match in query gets highest score
                if (term === terms[0]) score += 10;
                else score += 2; // Related semantic terms get lower score
            }
        }
        return score;
    }
}

export const semanticSearchService = new SemanticSearchService();
