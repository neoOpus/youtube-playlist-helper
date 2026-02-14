import { writable } from "svelte/store";

/**
 * Interface representing a reversible user action.
 */
export interface Action {
  /**
   * Descriptive name of the action (e.g., "Delete Video").
   */
  name: string;
  /**
   * Function to revert the action.
   */
  undo: () => void | Promise<void>;
  /**
   * Epoch timestamp when the action occurred.
   */
  timestamp: number;
}

/**
 * Internal history stack for undoable actions.
 */
const history: Action[] = [];

/**
 * Svelte store representing the last performed action.
 * Useful for displaying notifications with an "Undo" button.
 */
export const lastAction = writable<Action | null>(null);

/**
 * Service for logging and undoing user actions.
 */
export const actionLogger = {
  /**
   * Logs a new action to the history.
   * @param name Name of the action.
   * @param undo Reversal function.
   */
  log(name: string, undo: () => void | Promise<void>) {
    const action: Action = { name, undo, timestamp: Date.now() };
    history.push(action);
    lastAction.set(action);

    // Auto-clear notification after 10 seconds
    setTimeout(() => {
      lastAction.update(current => current === action ? null : current);
    }, 10000);

    console.debug(`Action logged: ${name}`);
  },

  /**
   * Executes the undo function of the last logged action.
   */
  async undo() {
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

  /**
   * Clears the entire action history.
   */
  clear() {
      history.length = 0;
      lastAction.set(null);
  }
};
