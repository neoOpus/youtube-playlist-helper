import { Notyf } from "notyf";

const notify = new Notyf({
  duration: 5000,
  dismissible: true,
});

const inform = new Notyf({
  duration: 5000,
  dismissible: true,
  types: [
    {
      type: "info",
      background: "#007bff",
      icon: false,
    },
  ],
});

export const notificationService = {
  error(message: string) {
    notify.error(message);
    return () => notify.dismissAll();
  },
  success(message: string) {
    notify.success(message);
    return () => notify.dismissAll();
  },
  info(message: string) {
    inform.open({ type: "info", message });
    return () => inform.dismissAll();
  }
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

if (typeof window !== 'undefined') {
    (window as any).error = notificationService.error;
    (window as any).success = notificationService.success;
    (window as any).info = notificationService.info;
}
