import { describe, it, expect, vi } from 'vitest';
import { actionLogger, lastAction } from './action-logger';
import { get } from 'svelte/store';

describe('actionLogger', () => {
  it('should log an action and update lastAction store', () => {
    const undo = vi.fn();
    actionLogger.log('Test Action', undo);

    const currentAction = get(lastAction);
    expect(currentAction).not.toBeNull();
    expect(currentAction?.name).toBe('Test Action');
  });

  it('should execute undo and clear lastAction', async () => {
    const undo = vi.fn();
    actionLogger.log('Test Action', undo);

    await actionLogger.undo();

    expect(undo).toHaveBeenCalled();
    expect(get(lastAction)).toBeNull();
  });
});
