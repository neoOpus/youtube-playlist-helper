import { Notyf } from "notyf";

let notify: Notyf;
let inform: Notyf;

function getNotyf() {
  if (typeof window === "undefined") return null;
  if (notify) return notify;

  notify = new Notyf({
    duration: 5000,
    dismissible: true,
  });
  return notify;
}

function getInform() {
  if (typeof window === "undefined") return null;
  if (inform) return inform;

  inform = new Notyf({
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
  return inform;
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
    timeout = setTimeout(() => func(...args), wait);
  };
}

if (typeof window !== 'undefined') {
  (window as any).error = notificationService.error;
  (window as any).success = notificationService.success;
  (window as any).info = notificationService.info;
}
