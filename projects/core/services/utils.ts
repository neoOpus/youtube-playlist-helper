import { Notyf } from "notyf";

let notify: any;
let inform: any;

if (typeof window !== 'undefined') {
    notify = new Notyf({
        duration: 5000,
        dismissible: true,
    });

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
}

export const notificationService = {
  error(message: string) {
    if (notify) notify.error(message);
    else console.error(message);
    return () => notify && notify.dismissAll();
  },
  success(message: string) {
    if (notify) notify.success(message);
    else console.log("SUCCESS:", message);
    return () => notify && notify.dismissAll();
  },
  info(message: string) {
    if (inform) inform.open({ type: "info", message });
    else console.log("INFO:", message);
    return () => inform && inform.dismissAll();
  }
};

if (typeof window !== 'undefined') {
    (window as any).error = notificationService.error;
    (window as any).success = notificationService.success;
    (window as any).info = notificationService.info;
}

/**
 * Basic sanitization for strings.
 */
export function sanitize(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
