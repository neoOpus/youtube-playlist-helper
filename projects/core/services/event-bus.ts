/**
 * Simple Event Bus for cross-service communication without circular dependencies.
 */
type EventCallback = (data?: any) => void;

class EventBus {
    private listeners: Record<string, EventCallback[]> = {};

    /**
     * Subscribe to an event.
     * @returns Unsubscribe function.
     */
    on(event: string, callback: EventCallback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
        return () => this.off(event, callback);
    }

    /**
     * Unsubscribe from an event.
     */
    off(event: string, callback: EventCallback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    /**
     * Emit an event.
     */
    emit(event: string, data?: any) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }
}

export const eventBus = new EventBus();

// Defined events constants
export const EVENTS = {
    PLAYLIST_SAVED: 'playlist:saved',
    PLAYLIST_DELETED: 'playlist:deleted',
    SETTINGS_CHANGED: 'settings:changed',
    SYNC_STARTED: 'sync:started',
    SYNC_COMPLETED: 'sync:completed',
    SYNC_ERROR: 'sync:error',
    UNDO_PERFORMED: 'undo:performed'
};
