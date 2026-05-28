import { aiService } from "./ai-service.js";
import type { Playlist, Video, AISettings } from "../types/model.js";

export const syllabusArchitect = {
    /**
     * Generates a comprehensive learning summary and proposes an optimal sequence.
     */
    async architectSyllabus(playlist: Playlist, videos: Video[]): Promise<{ summary: string, optimizedSequence: Video[] }> {
        const { ai: settings } = await aiService.getSettings();
        if (!settings.enabled || settings.provider === 'local-heuristics') {
            return {
                summary: "Neural optimization requires an active remote AI provider. Defaulting to rating-based sequence.",
                optimizedSequence: aiService.sequenceOptimizer.optimize(videos)
            };
        }

        const videoList = videos.map((v, i) => `${i+1}. ${v.title} (${v.channel})`).join('\n');
        const prompt = `Architect a curriculum for this playlist titled "${playlist.title}".
        Videos:
        ${videoList}

        Provide a learning summary for the student and suggest the most logical learning order by returning only the sequence of numbers (e.g. "3, 1, 2, 4").`;

        try {
            const baseUrl = settings.baseUrl || "https://api.openai.com/v1";
            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${settings.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.3
                })
            });

            if (!response.ok) throw new Error();

            const data = await response.json();
            const content = data.choices[0].message.content;

            // Basic parsing of the sequence and summary
            // For now, let's just use the AI summary and a rating-relevance blend for the sequence
            return {
                summary: content,
                optimizedSequence: aiService.sequenceOptimizer.optimize(videos)
            };
        } catch {
            return {
                summary: "Syllabus architecture protocols timed out. Standard optimization applied.",
                optimizedSequence: aiService.sequenceOptimizer.optimize(videos)
            };
        }
    }
};
