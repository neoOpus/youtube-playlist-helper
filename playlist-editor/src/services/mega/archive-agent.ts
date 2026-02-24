import { storage } from '../core/storage-service';
import type { Video } from '../../types/model';

export interface ArchiveTask {
    videoId: string;
    title: string;
    status: 'pending' | 'archived' | 'failed';
    lastAttempt?: number;
}

class ArchiveAgent {
    private readonly STORAGE_KEY = "archive_tasks";

    async getTasks(): Promise<ArchiveTask[]> {
        return await storage.get(this.STORAGE_KEY, []);
    }

    async scheduleArchival(video: Video) {
        const tasks = await this.getTasks();
        if (tasks.find(t => t.videoId === video.videoId)) return;

        const newTask: ArchiveTask = {
            videoId: video.videoId,
            title: video.title,
            status: 'pending'
        };
        await storage.set(this.STORAGE_KEY, [...tasks, newTask]);
    }

    async processQueue() {
        const tasks = await this.getTasks();
        const pending = tasks.filter(t => t.status === 'pending');

        for (const task of pending) {
            try {
                // Wayback Machine Save API simulation
                // In reality, this would be a POST to https://web.archive.org/save/URL
                console.log(`Proactively archiving: ${task.title}`);
                task.status = 'archived';
                task.lastAttempt = Date.now();
            } catch (e) {
                task.status = 'failed';
            }
        }
        await storage.set(this.STORAGE_KEY, tasks);
    }

    // AI Heuristic: Identifies "Risk" videos (News, Politics, Tech leaks)
    shouldProactivelyArchive(video: Video): boolean {
        const riskKeywords = ['leak', 'breaking', 'news', 'controversy', 'exclusive', 'deleted soon'];
        const title = video.title.toLowerCase();
        return riskKeywords.some(kw => title.includes(kw));
    }
}

export const archiveAgent = new ArchiveAgent();
