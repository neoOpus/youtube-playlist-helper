import { Notyf } from "notyf";

let notifyInstance: Notyf | null = null;
let informInstance: Notyf | null = null;

/**
 * Lazy-initializes Notyf for main notifications.
 * Browser-only.
 */
function getNotyf() {
  if (typeof window === "undefined") return null;
  if (!notifyInstance) {
    notifyInstance = new Notyf({
      duration: 5000,
      dismissible: true,
    });
  }
  return notifyInstance;
}

/**
 * Lazy-initializes Notyf for information-type notifications.
 * Browser-only.
 */
function getInform() {
  if (typeof window === "undefined") return null;
  if (!informInstance) {
    informInstance = new Notyf({
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
  }
  return informInstance;
}

export const notificationService = {
  error(message: string) {
    const n = getNotyf();
    n?.error(message);
    return () => n?.dismissAll();
  },
  success(message: string) {
    const n = getNotyf();
    n?.success(message);
    return () => n?.dismissAll();
  },
  info(message: string) {
    const i = getInform();
    i?.open({ type: "info", message });
    return () => i?.dismissAll();
  },
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
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Global legacy support for extension background/popup scripts
if (typeof window !== "undefined") {
  (window as any).error = notificationService.error;
  (window as any).success = notificationService.success;
  (window as any).info = notificationService.info;
}
