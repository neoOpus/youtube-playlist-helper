import { writable } from "svelte/store";

export interface Action {
  name: string;
  undo: () => void | Promise<void>;
  timestamp: number;
}

const history = [] as Action[];
export const lastAction = writable<Action | null>(null);

export const actionLogger = {
  log(name: string, undo: () => void | Promise<void>) {
    const action = { name, undo, timestamp: Date.now() };
    history.push(action);
    lastAction.set(action);

    // Auto-clear after 10 seconds
    setTimeout(() => {
      lastAction.update(current => current === action ? null : current);
    }, 10000);
  },

  async undo() {
    const action = history.pop();
    if (action) {
      await action.undo();
      lastAction.set(null);
    }
  }
};
