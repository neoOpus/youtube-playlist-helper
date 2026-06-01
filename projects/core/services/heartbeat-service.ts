import { writable, type Writable } from 'svelte/store';

export interface AgentStatus {
    id: string;
    name: string;
    state: 'idle' | 'working' | 'error' | 'suspended';
    lastActive: number;
    message?: string;
    progress?: number;
    activeNodeId?: string | number;
}

const agentStates: Record<string, AgentStatus> = {};
export const globalHeartbeat: Writable<Record<string, AgentStatus>> = writable({});

export const heartbeatService = {
    registerAgent(id: string, name: string) {
        agentStates[id] = { id, name, state: 'idle', lastActive: Date.now() };
        this.broadcast();
    },

    updateAgent(id: string, updates: Partial<AgentStatus>) {
        if (!agentStates[id]) return;
        agentStates[id] = { ...agentStates[id], ...updates, lastActive: Date.now() };
        this.broadcast();
    },

    broadcast() {
        globalHeartbeat.set({ ...agentStates });
    },

    getSystemMetrics() {
        return {
            memory: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) : 0,
            uptime: Math.round(performance.now() / 1000),
            agentCount: Object.keys(agentStates).length
        };
    }
};
