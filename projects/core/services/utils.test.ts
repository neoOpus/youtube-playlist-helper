import { describe, it, expect, vi } from "vitest";
import { debounce } from "./utils";

describe("debounce", () => {
  it("should delay function execution", () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("should only execute the last call within the wait period", () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc("first");
    debouncedFunc("second");
    debouncedFunc("third");

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("third");
    vi.useRealTimers();
  });
});
