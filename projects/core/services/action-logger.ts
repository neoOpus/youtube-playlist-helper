import { writable } from "svelte/store";
import { eventBus, EVENTS } from "./event-bus";

/**
 * Interface representing a reversible user action.
 */
export interface Action {
  name: string;
  undo: () => void | Promise<void>;
  timestamp: number;
}

const history: Action[] = [];
export const lastAction = writable<Action | null>(null);

export const actionLogger = {
  log(name: string, undo: () => void | Promise<void>) {
    const action: Action = { name, undo, timestamp: Date.now() };
    history.push(action);
    lastAction.set(action);

    setTimeout(() => {
      lastAction.update(current => current === action ? null : current);
    }, 10000);

    console.debug(`Action logged: ${name}`);
  },

  async undo() {
    const action = history.pop();
    if (action) {
      console.debug(`Undoing action: ${action.name}`);
      try {
          await action.undo();
          eventBus.emit(EVENTS.UNDO_PERFORMED, action.name);
      } catch (err) {
          console.error(`Failed to undo action ${action.name}:`, err);
      }
      lastAction.set(null);
    }
  },

  clear() {
      history.length = 0;
      lastAction.set(null);
  }
};
