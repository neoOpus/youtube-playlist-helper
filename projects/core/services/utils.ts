import { Notyf } from "notyf";

interface INotyf {
    error: (msg: string) => void;
    success: (msg: string) => void;
    open: (options: { type: string, message: string }) => void;
    dismissAll: () => void;
}

let notify: INotyf | null = null;
let inform: INotyf | null = null;

if (typeof window !== 'undefined') {
    notify = new Notyf({
        duration: 5000,
        dismissible: true,
    }) as unknown as INotyf;

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
    }) as unknown as INotyf;
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

/**
 * Basic sanitization for strings.
 */
export function sanitize(str: string): string {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
