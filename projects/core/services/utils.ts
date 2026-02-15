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

if (typeof window !== 'undefined') {
    (window as any).error = notificationService.error;
    (window as any).success = notificationService.success;
    (window as any).info = notificationService.info;
}
