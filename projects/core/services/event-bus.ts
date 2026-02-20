import type { Playlist, Settings } from "../types/model";

/**
 * Strictly typed Event Bus for cross-service communication.
 * Engineered by Anoir Ben Tanfous aka neoOpus.
 */

export interface EventPayloads {
    'playlist:saved': Playlist;
    'playlist:deleted': string;
    'settings:changed': Settings;
    'sync:started': void;
    'sync:completed': void;
    'sync:error': Error;
    'undo:performed': string;
}

type EventCallback<T extends keyof EventPayloads> = (data: EventPayloads[T]) => void;

class EventBus {
    private listeners: { [K in keyof EventPayloads]?: Array<EventCallback<K>> } = {};

    on<T extends keyof EventPayloads>(event: T, callback: EventCallback<T>): () => void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        // @ts-ignore - dynamic key assignment with complex types
        this.listeners[event].push(callback);
        return () => this.off(event, callback);
    }

    off<T extends keyof EventPayloads>(event: T, callback: EventCallback<T>): void {
        const list = this.listeners[event];
        if (!list) return;
        // @ts-ignore
        this.listeners[event] = list.filter(cb => cb !== callback);
    }

    emit<T extends keyof EventPayloads>(event: T, data: EventPayloads[T]): void {
        const list = this.listeners[event];
        if (!list) return;
        // @ts-ignore
        list.forEach(cb => cb(data));
    }
}

export const eventBus = new EventBus();

export const EVENTS = {
    PLAYLIST_SAVED: 'playlist:saved' as const,
    PLAYLIST_DELETED: 'playlist:deleted' as const,
    SETTINGS_CHANGED: 'settings:changed' as const,
    SYNC_STARTED: 'sync:started' as const,
    SYNC_COMPLETED: 'sync:completed' as const,
    SYNC_ERROR: 'sync:error' as const,
    UNDO_PERFORMED: 'undo:performed' as const
};
