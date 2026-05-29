import { writable, type Writable } from "svelte/store";

export interface Action {
  id: string;
  name: string;
  undo: () => void | Promise<void>;
  timestamp: number;
}

const history: Action[] = [];

export const lastAction: Writable<Action | null> = writable<Action | null>(null);

export const actionLogger = {
  log(name: string, undo: () => void | Promise<void>): void {
    const action: Action = {
        id: crypto.randomUUID(),
        name,
        undo,
        timestamp: Date.now()
    };
    history.push(action);
    lastAction.set(action);

    setTimeout(() => {
      lastAction.update(current => current && current.id === action.id ? null : current);
    }, 10000);

    console.debug(`Action logged: ${name}`);
  },

  async undo(): Promise<void> {
    const action = history.pop();
    if (action) {
      console.debug(`Undoing action: ${action.name}`);
      try {
          await action.undo();
      } catch (err) {
          console.error(`Failed to undo action ${action.name}:`, err);
      }
      lastAction.set(null);
    }
  },

  getHistory(): Action[] {
      return [...history].reverse();
  },

  clear(): void {
      history.length = 0;
      lastAction.set(null);
  }
};
