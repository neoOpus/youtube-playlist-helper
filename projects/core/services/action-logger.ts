import { writable, type Writable } from "svelte/store";

/**
 * Interface representing a reversible user action.
 */
export interface Action {
  /** Unique ID for tracking */
  id: string;
  /** Descriptive name of the action (e.g., "Delete Video"). */
  name: string;
  /** Function to revert the action. */
  undo: () => void | Promise<void>;
  /** Epoch timestamp when the action occurred. */
  timestamp: number;
}

/** Internal history stack for undoable actions. */
const history: Action[] = [];

/**
 * Svelte store representing the last performed action.
 * Typed as Writable<Action | null> for enhanced safety.
 */
export const lastAction: Writable<Action | null> = writable<Action | null>(null);

/**
 * Service for logging and undoing user actions with enhanced type safety.
 */
export const actionLogger = {
  /**
   * Logs a new action to the history.
   */
  log(name: string, undo: () => void | Promise<void>): void {
    const action: Action = {
        id: crypto.randomUUID(),
        name,
        undo,
        timestamp: Date.now()
    };
    history.push(action);
    lastAction.set(action);

    // Auto-clear notification after 10 seconds
    setTimeout(() => {
      lastAction.update(current => current && current.id === action.id ? null : current);
    }, 10000);

    console.debug(`Action logged: ${name}`);
  },

  /**
   * Executes the undo function of the last logged action.
   */
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

  /**
   * Clears the entire action history.
   */
  clear(): void {
      history.length = 0;
      lastAction.set(null);
  }
};
